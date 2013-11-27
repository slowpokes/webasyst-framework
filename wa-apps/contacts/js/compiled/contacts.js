(function ($) {
    $.wa.controller = {
        /** Remains true for free (not premium) version of Contacts app. */
        free: true,

        /** Kinda constructor. All the initialization stuff. */
        init: function (options) {
            this.frontend_url = (options && options.url) || '/';
            this.backend_url = (options && options.backend_url) || '/webasyst/';

            // Initialize "persistent" storage
            $.storage = new $.store();

            // Set up AJAX to never use cache
            $.ajaxSetup({
                cache: false
            });

            this.lastView = {
                title: $.storage.get('contacts/lastview/title'),
                hash: $.storage.get('contacts/lastview/hash')
            };
            this.options = options;
            this.random = null;

            $.wa.dropdownsCloseEnable();

            // call dispatch when hash changes
            if (typeof($.History) != "undefined") {
                $.History.bind(function (hash) {
                    $.wa.controller.dispatch(hash);
                });
            }

            $.wa.errorHandler = function (xhr) {
                if (xhr.status == 404) {
                    $.wa.setHash('/contacts/all/');
                    return false;
                }
                return true;
            }

            // .selected class for selected items in list
            $("#contacts-container .contacts-data input.selector").live('click', function () {
                if ($(this).is(':radio')) {
                    $(this).parents('.contact-row').siblings().removeClass('selected');
                }

                if ($(this).is(":checked")) {
                    $(this).parents('.contact-row').addClass('selected');
                } else {
                    $(this).parents('.contact-row').removeClass('selected');
                }

                $.wa.controller.updateSelectedCount();
            });

            // Collapsible sidebar sections
            var toggleCollapse = function () {
                $.wa.controller.collapseSidebarSection(this, 'toggle');
            };
            $(".collapse-handler", $('#wa-app')).die('click').live('click', toggleCollapse);

            // Restore collapsible sections status
            this.restoreCollapsibleStatusInSidebar();

            // Collapsible subsections
            $("ul.collapsible i.darr").click(function () {
                if ($(this).hasClass('darr')) {
                    $(this).parent('li').children('ul').hide();
                    $(this).removeClass('darr').addClass('rarr');
                } else {
                    $(this).parent('li').children('ul').show();
                    $(this).removeClass('rarr').addClass('darr');
                }
            });

            // Smart menu.
            // Implement a delay before mouseover and showing menu contents.
            var recentlyOpened = null;
            var animate = function(menu) {
                if (menu.hasClass('animated')) {
                    return false;
                }
                menu.addClass('animated');
                menu.hoverIntent({
                    over: function() {
                        recentlyOpened = setTimeout(function() {
                            recentlyOpened = null;
                        }, 500);
                        menu.removeClass('disabled');
                    },
                    timeout: 0.3, // out() is called after 0.3 sec after actual mouseout
                    out: function() {
                        menu.addClass('disabled');
                        if (recentlyOpened) {
                            clearTimeout(recentlyOpened);
                            recentlyOpened = null;
                        }
                    }
                });
                return true;
            };
            $('#c-list-toolbar-menu', $('#c-core')[0]).live('mouseover', function() {
                var menu = $(this);
                if (animate(menu)) {
                    menu.mouseover();
                }
            });
            // Open/close menu by mouse click
            $('#c-list-toolbar-menu', $('#c-core')[0]).live('click', function(e) {
                var menu = $(this);

                // do not close menu if it was just opened via mouseover
                if (recentlyOpened && !menu.hasClass('disabled')) {
                    return;
                }

                // do not count clicks in nested menus
                if ($(e.target).parents('ul#c-list-toolbar-menu ul').size() > 0) {
                    return;
                }

                menu.toggleClass('disabled');
                if (!animate(menu) && recentlyOpened) {
                    clearTimeout(recentlyOpened);
                    recentlyOpened = null;
                }
            });

            // Do not save 404 pages as last hashes
            $(document).ajaxError(function() {
                $.storage.del('contacts/last-hash');
            });

            if (this.initFull) {
                this.initFull(options);
            }
        }, // end of init()

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // *   Dispatch-related
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        /** Cancel the next n automatic dispatches when window.location.hash changes */
        stopDispatch: function (n) {
            this.stopDispatchIndex = n;
        },


        // last hash processed by this.dispatch()
        previousHash: null,

        /** Force reload current hash-based 'page'. */
        redispatch: function() {
            this.previousHash = null;
            this.dispatch();
        },

        /**
          * Called automatically when window.location.hash changes.
          * Call a corresponding handler by concatenating leading non-int parts of hash,
          * e.g. for #/aaa/bbb/ccc/111/dd/12/ee/ff
          * a method $.wa.controller.AaaBbbCccAction(['111', 'dd', '12', 'ee', 'ff']) will be called.
          */
        dispatch: function (hash) {
            if (this.stopDispatchIndex > 0) {
                this.stopDispatchIndex--;
                return false;
            }

            if (hash === undefined) {
                hash = this.getHash();
            } else {
                hash = this.cleanHash(hash);
            }

            if (this.previousHash == hash) {
                return;
            }
            this.previousHash = hash;

            hash = hash.replace(/^[^#]*#\/*/, '');

            if (hash) {
                var save_hash = true;
                hash = hash.split('/');
                if (hash[0]) {
                    var actionName = "";
                    var attrMarker = hash.length;
                    for (var i = 0; i < hash.length; i++) {
                        var h = hash[i];
                        if (i < 2) {
                            if (i === 0) {
                                actionName = h;
                            } else if (parseInt(h, 10) != h) {
                                actionName += h.substr(0,1).toUpperCase() + h.substr(1);
                            } else {
                                attrMarker = i;
                                break;
                            }
                        } else {
                            attrMarker = i;
                            break;
                        }
                    }
                    var attr = hash.slice(attrMarker);

                    if (this[actionName + 'Action']) {
                        this.currentAction = actionName;
                        this.currentActionAttr = attr;
                        this[actionName + 'Action'](attr);
                    } else {
                        save_hash = false;
                        if (console) {
                            console.log('Invalid action name:', actionName+'Action');
                        }
                    }
                } else {
                    //if (console) console.log('DefaultAction');
                    this.defaultAction();
                }

                if (hash.join) {
                    hash = hash.join('/');
                }

                // save last page to return to by default later
                if(save_hash) {
                    $.storage.set('contacts/last-hash', hash);
                }
            } else {
                //if (console) console.log('DefaultAction');
                this.defaultAction();
                $.storage.del('contacts/last-hash');
            }

            // Highlight current item in history, if exists
            this.highlightSidebar();

            $(document).trigger('hashchange', [hash]);
        },

        /** Load last page  */
        lastPage: function() {
            var hash = $.storage.get('contacts/last-hash');
            if (hash) {
                $.wa.setHash('#/'+hash);
            } else {
                this.defaultAction();
            }
        },

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // *   Actions (called by dispatch() when hash changes)
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        /** Called when action is not found */
        defaultAction: function () {
            this.contactsAllAction();
        },

        /** Access control form for a group. */
        groupsRightsAction: function(p) {
            if (!p || !p[0]) {
                if (console) {
                    console.log('Group id not specified for groupsRightsAction.');
                }
                return;
            }

            this.loadHTML("?module=groups&action=rights&id="+p[0], null, function() {
                this.setBlock();
            });
        },

        /** Empty form to create a user group */
        groupsCreateAction: function(params) {
            this.groupsEditAction();
        },

        /** Form to edit or create a user group */
        groupsEditAction: function(params) {
            this.loadHTML("?module=groups&action=editor"+(params && params[0] ? '&id='+params[0] : ''), null, function() {
                this.setBlock();
            });
        },

        /** Empty form to create a contacts category */
        categoriesCreateAction: function(params) {
            this.categoriesEditAction();
        },

        /** Form to edit or create a contacts category */
        categoriesEditAction: function(params) {
            this.loadHTML("?module=categories&action=editor"+(params && params[0] ? '&id='+params[0] : ''), null, function() {
                this.setBlock();
            });
        },

        /** Dialog to confirm deletion of a category. */
        categoriesDeleteAction: function(params) {
            var backOnCancel = true;
            if (!params || !params[0]) {
                params = [this.current_category_id];
                backOnCancel = false;
            }

            $.wa.dialogCreate('delete-dialog', {
                content: $('<h2>'+$_('Delete this category?')+'</h2><p>'+$_('No contacts will be deleted.')+'</p>'),
                buttons: $('<div></div>')
                    .append(
                        $('<input type="submit" class="button red" value="'+$_('Delete category')+'">').click(function() {
                            if ($(this).find('.loading').size() <= 0) {
                                $('<i style="margin: 8px 0 0 10px" class="icon16 loading"></i>').insertAfter(this);
                            }
                            $.post('?module=categories&action=delete', {'id': params[0]}, function() {
                                // Remove deleted category from sidebar
                                $.wa.controller.reloadSidebar();
                                $.wa.dialogHide();
                                $.wa.setHash('#/users/all/');
                            });
                        })
                    )
                    .append(' '+$_('or')+' ')
                    .append($('<a href="javascript:void(0)">'+$_('cancel')+'</a>').click(function() {
                        $.wa.dialogHide();
                        if (backOnCancel) {
                            $.wa.controller.stopDispatch(1);
                            $.wa.back();
                        }
                    })),
                small: true
            });
            return false;
        },

        /** List of contacts in user group.  */
        contactsGroupAction: function (params) {
            if (!params || !params[0]) {
                return;
            }

            this.showLoading();
            var p = this.parseParams(params.slice(1), 'contacts/group/'+params[0]);
            p.fields = ['name', 'email', 'company', '_access'];
            p.query = 'group/' + params[0];
            this.loadGrid(p, '/contacts/group/' + params[0] + '/', false, {
                afterLoad: function (data) {
                    $('#list-group li[rel="group'+params[0]+'"]').children('span.count').html(data.count);
                },
                beforeLoad: function() {
                    this.current_group_id = params[0];
                    this.setBlock('contacts-list', null, ['group-actions']);
                }
            });
        },

        /** Dialog to confirm deletion of a user group. */
        groupsDeleteAction: function(params) {
            var backOnCancel = true;
            if (!params || !params[0]) {
                params = [this.current_group_id];
                backOnCancel = false;
            }

            $.wa.dialogCreate('delete-dialog', {
                content: $('<h2>'+$_('Delete this group?')+'</h2><p>'+$_('No contacts will be deleted.')+'</p>'),
                buttons: $('<div></div>')
                    .append(
                        $('<input type="submit" class="button red" value="'+$_('Delete group')+'">').click(function() {
                            $('<i style="margin: 8px 0 0 10px" class="icon16 loading"></i>').insertAfter(this);
                            $.post('?module=groups&action=delete', {'id': params[0]}, function() {
                                // Remove deleted group from sidebar
                                $('#wa-app .sidebar a[href="#/contacts/group/'+params[0]+'/"]').parent().remove();
                                if ($('#list-group').children().size() <= 0) {
                                    $.wa.controller.reloadSidebar();
                                }
                                $.wa.dialogHide();
                                $.wa.setHash('#/users/all/');
                            });
                        })
                    )
                    .append(' '+$_('or')+' ')
                    .append($('<a href="javascript:void(0)">'+$_('cancel')+'</a>').click(function() {
                        $.wa.dialogHide();
                        if (backOnCancel) {
                            $.wa.controller.stopDispatch(1);
                            $.wa.back();
                        }
                    })),
                small: true
            });
            return false;
        },

        /** Empty form to create a new contact. */
        contactsAddAction: function (params) {
            this.loadHTML("?module=contacts&action=add"+(params && params[0] ? '&company=1' : ''), null, function() {
                this.setBlock('contacts-info');
            });
        },

        /** Contact profile */
        contactAction: function (params) {
            var p = {};
            if (params[1]) {
                p = {'tab': params[1]};
            }
            this.showLoading();
            this.load("#c-core", "?module=contacts&action=info&id=" + params[0], p, function() {
                this.setBlock('contacts-info');
            });
        },

        /** Contact photo editor */
        contactPhotoAction: function (params) {
            this.showLoading();
            this.loadHTML("?module=photo&action=editor&id=" + params[0] + (params[1] ? '&uploaded=1' : ''), {}, function() {
                this.setBlock('contacts-info');
            });
        },

        /** List of all contacts */
        contactsAllAction: function (params) {
            this.showLoading();
            this.loadGrid(this.parseParams(params, 'contacts/all'), '/contacts/all/', false, {
                beforeLoad: function() {
                    this.setBlock('contacts-list');
                },
                afterLoad: function (data) {
                    $('#sb-all-contacts-li span.count').html(data.count);
                }
            });
        },

        /** Anvanced search form (in premium contacts) or search results list, including simple search. */
        contactsSearchAction: function (params, options) {
            if (!params || !params[0] || params[0] == 'form') {
                if (!this.contactsSearchForm) {
                    if (console) {
                        console.log('No advanced search in free contacts.');
                        setTimeout(function() { $.wa.setHash('#/'); }, 1);
                    }
                    return;
                }
                return this.contactsSearchForm(params && params[0] === 'form' ? params.slice(1) : []);
            }
            this.showLoading();

            if (params[0] == 'results') {
                if (!options) {
                    options = {search: true};
                }
                params = params.slice(1);
            }
            var filters = params[0];
            if (filters.substr(0,1) == '?') {
                filters = filters.substr(1);
            }
            var p = this.parseParams(params.slice(1), 'contacts/search/'+filters);
            p.query = filters;
            if (options && options.search) {
                p.search = 1;
            }

            var hash = this.cleanHash('#/contacts/search/'+filters);
            var el = null;
            this.loadGrid(p, hash.substr(1), null, {
                beforeLoad: function() {
                    this.setBlock('contacts-list', false, ['search-actions']);
                    el = this.setTitle();
                    if (options && options.search) {
                        $("#list-main .item-search").show();
                        $("#list-main .item-search a").attr('href', '#/contacts/search/results/' + params[0] + '/');
                        //if (!this.free) {
                        //    $('<a style="display:block" href="#/contacts/search/form/' + params[0] + '/">'+$_('edit search')+'</a>').insertAfter(el);
                        //}
                        p.search = 1;
                    }
                }
            });
        },

        /** List of contacts in a category */
        contactsCategoryAction: function (params) {
            if(!params || !params[0]) {
                return;
            }

            this.showLoading();
            var p = this.parseParams(params.slice(1), 'contacts/category/'+params[0]);
            p.query = '/category/' + params[0];
            this.loadGrid(p, '/contacts/category/' + params[0] + '/', false, {
                beforeLoad: function(data) {
                    this.current_category_id = params[0];
                    this.setBlock('contacts-list', null, data && data.system_category ? [] : ['category-actions']);
                },
                afterLoad: function (data) {
                    $('#list-category li[rel="category'+params[0]+'"]').children('span.count').html(data.count);
                }
            });
        },

        /** List of all users */
        usersAllAction: function (params) {
            this.showLoading();
            var p = this.parseParams(params, 'users/all');
            p.query = '/users/all/';
            p.fields = ['name', 'email', 'company', '_access'];
            this.loadGrid(p, '/users/all/', false, {
                beforeLoad: function() {
                    this.setBlock('contacts-list');
                },
                afterLoad: function (data) {
                    $('#sb-all-users-li span.count').html(data.count);
                }
            });
        },

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // *   Other UI-related stuff: dialogs, form submissions etc.
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        /** Simple search submit. */
        simpleSearch: function () {
            var s = $.trim($("#search-text").val());
            if (!s) {
                return;
            }

            var q = '';
            /*if (s.indexOf('=') == -1) {*/
                s = s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/&/g, '\\&').replace(/\+/g, '%2B').replace(/\//g, '%2F');
                if (s.indexOf('@') != -1) {
                    q = "email*=" + s; //encodeURIComponent(s);
                } else {
                    q = "name*=" + s; //encodeURIComponent(s);
                }
            /*} else {
                q = s;
            }*/
            $.wa.controller.stopDispatch(1);
            $.wa.setHash("#/contacts/search/" + q + '/');
            $.wa.controller.contactsSearchAction([q], {search: true});
        },

        /**
         * Add contacts to categories and show success message above contacts list.
         * @param {Array|Number} category_ids
         * @param {Array|Number} contact_ids defaults to selected contacts
         **/
        addToCategory: function(category_ids, contact_ids) {
            contact_ids = contact_ids || $.wa.grid.getSelected();
            $.wa.controller.showMessage('', true);
            if (!contact_ids.length || !category_ids) {
                return;
            }

            $.post('?module=categories&type=add', {
                contacts: contact_ids,
                categories: category_ids
            }, function(response) {
                if (response.data && response.data.count) {
                    for (var category_id in response.data.count) {
                        $('#list-category li[rel="category' + category_id+ '"] span.count').html(response.data.count[category_id]);
                    }
                }
                $.wa.controller.showMessage(response.data.message, true);
            }, 'json');
        },

        /** Dialog to choose categories to add selected contacts to. */
        dialogAddSelectedToCategory: function() {
            if ($.wa.grid.getSelected().length <= 0 || $('#list-category li:not(.empty):not(.selected):not(.hint)').size() <= 0) {
                $.wa.controller.showMessage('<span class="errormsg">'+$_('No categories available')+'</span>', true);
                return;
            }
            var self = this;
            $('<div id="add-to-category-dialog"></div>').waDialog({
                url: '?module=categories&action=addSelected'+(self.current_category_id ? '&disabled='+self.current_category_id : '')
            });
        },

        /** Confirm to remove selected contacts from current category. */
        dialogRemoveSelectedFromCategory: function(ids) {
            ids = ids || $.wa.grid.getSelected();
            if (ids.length <= 0 || !$.wa.controller.current_category_id) {
                return;
            }
            $('<div id="confirm-remove-from-category-dialog" class="small"></div>').waDialog({
                content: $('<h2></h2>').text($_('Exclude contacts from category "%s"?').replace('%s', $('h1.wa-page-heading').text())),
                buttons: $('<div></div>')
                .append(
                    $('<input type="submit" class="button red" value="'+$_('Exclude')+'">').click(function() {
                        $('<i style="margin: 8px 0 0 10px" class="icon16 loading"></i>').insertAfter(this);
                        $.post('?module=categories&type=del', {'categories': [$.wa.controller.current_category_id], 'contacts': ids}, function(response) {
                            $.wa.dialogHide();
                            $.wa.controller.afterInitHTML = function () {
                                $.wa.controller.showMessage(response.data.message);
                            };
                            $.wa.controller.redispatch();
                        }, 'json');
                    })
                )
                .append(' '+$_('or')+' ')
                .append($('<a href="javascript:void(0)">'+$_('cancel')+'</a>').click($.wa.dialogHide))
            });
        },

        /** Remove selected contacts from current group and show success message above contacts list.
          * Not used and probably needs to be rewritten. */
        excludeFromGroup: function () {
            var group_id = $.wa.grid.settings.group;
            $.post("?module=contacts&action=groups&type=del",
                {'group_id': group_id, 'id[]': $.wa.grid.getSelected()},
                function (response) {
                if (response.status == 'ok') {
                    $.wa.controller.afterInitHTML = function () {
                        $.wa.controller.showMessage(response.data.message);
                    };
                    $.wa.controller.redispatch();
                }
            }, "json");
        },

        /** For a set of contact ids (defaults to currently selected) show a delete confirm dialog
          * with list of links to other applications. */
        contactsDelete: function (ids) {
            ids = ids || $.wa.grid.getSelected();
            if (ids.length <= 0) {
                return;
            }
            $.wa.dialogCreate('delete-dialog', {
                content: '<h2>'+$_('Checking links to other applications...')+' <i class="icon16 loading"></i></h2>',
                url: '?module=contacts&action=links',
                small: true,
                post: {
                    'id[]': ids
                }
            });
        },

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // *   Helper functions
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        listTabs: [],
        addListTab: function(showCallback) {
            this.listTabs.push(showCallback);
        },

        /** Prepare application layout to load new content. */
        setBlock: function (name, title, menus) {
            if (!name) {
                name = 'default';
            }

            if (title === undefined) {
                title = $_('Loading...');
            }

            var prevBlock = this.block;
            this.block = name;
            $("#c-core .c-core-header").remove();

            var el = $('#c-core .c-core-content');
            if (el.size() <= 0) {
                el = $('#c-core').empty()
                                .append($('<div class="contacts-background"><div class="block not-padded c-core-content"></div></div>'))
                                .find('.c-core-content');
            }
            el.html('<div class="block"><h1 class="wa-page-heading">' + title + ' <i class="icon16 loading"></i></h1></div>');

            // Scroll to window top
            $.scrollTo(0);

            //
            // Some menus need to be shown near the header
            //
            // Actions with group
            if (menus && menus.indexOf('group-actions') >= 0 && this.current_group_id) {
                el.find('div.block').prepend(
                    '<ul class="menu-h c-actions">'+
                        '<li>'+
                            '<a href="#/groups/edit/'+this.current_group_id+'/"><i class="icon16 edit"></i>'+$_('Edit group')+'</a>'+
                        '</li>'+
                        '<li>'+
                            '<a href="#/groups/rights/'+this.current_group_id+'/"><i class="icon16 lock-unlocked"></i>'+$_('Customize access')+'</a>'+
                        '</li>'+
                        '<li>'+
                            '<a href="#/groups/delete/'+this.current_group_id+'/" onclick="return $.wa.controller.groupsDeleteAction();"><i class="icon16 delete"></i>'+$_('Delete')+'</a>'+
                        '</li>'+
                    '</ul>');
            } else
            // Actions with category
            if (menus && menus.indexOf('category-actions') >= 0 && this.current_category_id && this.global_admin) {
                el.find('div.block').prepend(
                    '<ul class="menu-h c-actions">'+
                        '<li>'+
                            '<a href="#/categories/edit/'+this.current_category_id+'/"><i class="icon16 edit"></i>'+$_('Edit category')+'</a>'+
                        '</li>'+
                        '<li>'+
                            '<a href="#/categories/delete/'+this.current_category_id+'/" onclick="return $.wa.controller.categoriesDeleteAction();"><i class="icon16 delete"></i>'+$_('Delete')+'</a>'+
                        '</li>'+
                    '</ul>');
            } else
            // actions with search
            if (menus && menus.indexOf('search-actions') >= 0 && !this.free) {
                el.find('div.block').prepend(
                    '<ul class="menu-h c-actions">'+
                        '<li>'+
                            '<a href="#" onclick="return $.wa.controller.saveSearchAsFilter()"><i class="icon16 save-as-filter"></i>'+$_('Save as a filter')+'</a>'+
                        '</li>'+
                    '</ul>');
            } else
            // actions with list
            if (menus && menus.indexOf('list-actions') >= 0 && this.current_view_id) {
                el.find('div.block').prepend(
                    '<ul class="menu-h c-actions">'+
                        '<li>'+
                            '<a href="#/lists/edit/'+this.current_view_id+'/"><i class="icon16 edit"></i>'+$_('Edit list')+'</a>'+
                        '</li>'+
                        '<li>'+
                            '<a href="#" onclick="return $.wa.controller.deleteList('+this.current_view_id+')"><i class="icon16 delete"></i>'+$_('Delete')+'</a>'+
                        '</li>'+
                    '</ul>');
            } else
            // actions with filter
            if (menus && menus.indexOf('view-actions') >= 0 && this.current_view_id) {
                el.find('div.block').prepend(
                    '<ul class="menu-h c-actions">'+
                        '<li>'+
                            '<a href="#/filters/edit/'+this.current_view_id+'/"><i class="icon16 edit"></i>'+$_('Edit filter')+'</a>'+
                        '</li>'+
                        '<li>'+
                            '<a href="#" onclick="return $.wa.controller.deleteList('+this.current_view_id+', true)"><i class="icon16 delete"></i>'+$_('Delete')+'</a>'+
                        '</li>'+
                    '</ul>');
            }

            switch (name) {
                case 'contacts-duplicates':
                case 'contacts-list':
                    // Tabs above contacts list
                    if (this.listTabs.length > 0) {
                        var tabs = $('<ul class="tabs" id="c-list-tabs"></ul>');

                        // currently selected view in sidebar
                        var currentView = ($('#wa-app .sidebar .selected a').attr('href') || '').replace(/^[^#]*#/g, '');
                        if (currentView[0] !== '/') {
                            currentView = '/'+currentView;
                        }

                        // Plugin tabs
                        for(var i = 0; i < this.listTabs.length; i++) {
                            if (typeof this.listTabs[i] == 'function') {
                                this.listTabs[i].call($.wa.controller, tabs, currentView);
                            }
                        }

                        if (tabs.children().size() > 0) {
                            // Contacts tab
                            tabs.prepend($('<li class="selected"></li>').append(
                                    $('<a href="#'+currentView+'">'+$_('Contacts')+'</a>').click(function() {
                                        $('#c-list-tabs .selected').removeClass('selected');
                                        $(this).parent().addClass('selected');
                                        $.wa.controller.showLoading();
                                        return true;
                                    })
                                )
                            );
                            el.append(tabs);
                        }
                    }

                    el.append('<div id="contacts-container" class="tab-content"></div>');
                    if (!el.next().hasClass('clear-left')) {
                        $('<div class="clear-left"></div>').insertAfter(el);
                    }
                    this.showMenus(menus ? menus : []);
                    el.find('#contacts-container').append('<div class="block not-padded contacts-data"></div>');
                    break;
                case 'contacts-info':
                case 'default':
                    break;
                default:
                    this.block = prevBlock;
                    throw new Error('Unknown block: '+name);
            }

            if (this.afterInitHTML) {
                this.afterInitHTML();
                this.afterInitHTML = '';
            }
        },

        /** Add or update a toolbar above contacts list. */
        showMenus: function (show) {
            // Actions with selected
            var toolbar =
                '<li>' +
                    '<a href="javascript:void(0)" class="inline-link"><b><i><strong>'+$_('Actions with selected')+'</strong></i></b><i class="icon10 darr"></i></a>' +
                        '<ul class="menu-v" id="actions-with-selected">' +
                            '<li class="line-after">'+
                                '<span id="selected-count">0</span> <span id="selected-count-word-form">'+$_(0, 'contacts selected')+'</span>'+
                            '</li>'+
                            '<li id="add-to-category-link">' +
                                '<a href="#" onclick="$.wa.controller.dialogAddSelectedToCategory(); return false"><i class="icon16 contact"></i>'+$_('Add to category')+'</a>' +
                            '</li>' +
                            ((show.indexOf('category-actions') >= 0 && this.current_category_id) ?
                                '<li>' +
                                    '<a href="#" onclick="$.wa.controller.dialogRemoveSelectedFromCategory(); return false"><i class="icon16 contact"></i>'+$_('Exclude from this category')+'</a>'+
                                '</li>' : '') +
                            ((show.indexOf('list-actions') >= 0 && this.current_view_id) ?
                                '<li>' +
                                    '<a href="#" onclick="$.wa.controller.dialogRemoveSelectedFromList(); return false"><i class="icon16 from-list"></i>'+$_('Exclude from this list')+'</a>'+
                                '</li>' : '') +
                            ($.wa.controller.addToListDialog ?
                                '<li>' +
                                    '<a href="#" onclick="$.wa.controller.addToListDialog(); return false"><i class="icon16 add-to-list"></i>'+$_('Add to list')+'</a>' +
                                '</li>' : '') +
                            (($.wa.controller.contactsMerge && $.wa.controller.admin) ?
                                '<li>' +
                                    '<a href="#" onClick="$.wa.controller.contactsMerge(); return false"><i class="icon16 merge"></i>'+$_('Merge')+'</a>' +
                                '</li>' : '') +
                            ($.wa.controller.exportDialog ?
                                '<li>' +
                                    '<a href="#" onclick="$.wa.controller.exportDialog(); return false"><i class="icon16 export"></i>'+$_('Export')+'</a>' +
                                '</li>' : '') +
                            '<li>' +
                                '<a href="#" onclick="$.wa.controller.contactsDelete(); return false" class="red" id="show-dialog-delete"><i class="icon16 delete"></i>'+$_('Delete')+'</a>' +
                            '</li>' +
                        '</ul>' +
                    '</li>';

            // View selection
            toolbar =
                '<ul id="list-views" class="menu-h float-right">' +
                    '<li rel="table"><a href="#" onclick="return $.wa.grid.setView(\'table\');"><i class="icon16 only view-table"></i></a></li>' +
                    '<li rel="list"><a href="#" onclick="return $.wa.grid.setView(\'list\');"><i class="icon16 only view-thumb-list"></i></a></li>' +
                    '<li rel="thumbs"><a href="#" onclick="return $.wa.grid.setView(\'thumbs\');"><i class="icon16 only view-thumbs"></i></a></li>' +
                '</ul>' +
                '<ul id="c-list-toolbar-menu" class="menu-h dropdown disabled">' + toolbar + '</ul>';

            var el = $('#contacts-container').find('.c-list-toolbar');
            if (el.size() <= 0) {
                el = $('<div class="block c-list-toolbar"></div>').prependTo($('#contacts-container'));
            }
            el.html(toolbar);
            $.wa.controller.updateSelectedCount();
        },

        /** Show the loading indicator in the header */
        showLoading: function() {
            var h1 = $('h1');
            if(h1.size() <= 0) {
                return; // could show it somewhere else in theory...
            }
            h1 = $(h1[0]);
            if (h1.find('.loading').size() > 0) {
                return;
            }
            h1.append('<i class="icon16 loading"></i>');
        },

        /** Hide indicator shown by this.showLoading() */
        hideLoading: function() {
            $('h1 .loading').remove();
        },

        /** Update number of selected contacts shown in Actions with selected menu. */
        updateSelectedCount: function() {
            var cnt = $("input.selector:checked").size();
            $('#selected-count').text(cnt);
            $('#selected-count-word-form').text($_(cnt, 'contacts selected'));
            if (cnt <= 0) {
                $('#actions-with-selected li').addClass('disabled');
            } else {
                $('#actions-with-selected li').removeClass('disabled');

                // if there are no categories then leave add to category link disabled
                if ($('#list-category li:not(.empty):not(.selected)').size() <= 0) {
                    $('#add-to-category-link').addClass('disabled');
                }
            }
        },

        getUrl: function () {
            return this.options.url;
        },

        /** Load html from url into main content block. */
        loadHTML: function (url, params, beforeLoadCallback, el) {
            this.showLoading();
            this.load(el || "#c-core .c-core-content", url, params, beforeLoadCallback);
        },

        /** Load content from url and put it into elem. Params are passed to url as get parameters. */
        load: function (elem, url, params, beforeLoadCallback) {
            var r = Math.random();
            this.random = r;
            $.get(url, params, function (response) {
                if ($.wa.controller.random == r) {
                    if (beforeLoadCallback) {
                        beforeLoadCallback.call($.wa.controller);
                    }
                    $(elem).html(response);
                }
            });
        },

        /** Helper function to parse contacts list params from a hash */
        parseParams: function (params, hashkey) {
            var p = {};
            if (params && params[0]) {
                p.offset = params[0];
            }
            if (params && params[1]) {
                p.sort = params[1];
            }
            if (params && params[2]) {
                p.order = params[2];
            }

            if (params && params[3]) {
                p.view = params[3];
                if (hashkey) {
                    $.storage.set('contacts/view/'+hashkey, p.view);
                }
            } else {
                // If view is not explicitly set then use the last opened view, if present
                p.view = $.storage.get('contacts/view/'+hashkey) || 'table';
            }
            if (params && params[4]) {
                p.limit = params[4];
                if (hashkey) {
                    $.storage.set('contacts/limit/'+hashkey, p.limit);
                }
            } else {
                p.limit = $.storage.get('contacts/limit/'+hashkey);
            }
            return p;
        },

        /** Helper to set browser window title. */
        setBrowserTitle: function(title) {
            document.title = title + ' — ' + this.accountName;
        },

        /** Helper to set contacts list header. */
        setTitle: function (title, options) {
            var el = $("#c-core h1.wa-page-heading");
            if (typeof title != 'undefined') {
                this.lastView = {
                    title: title,
                    hash: window.location.hash.toString()
                };
                $.storage.set('contacts/lastview/title', this.lastView.title);
                $.storage.set('contacts/lastview/hash', this.lastView.hash);

                el.text(title);
                this.setBrowserTitle(title);
                if (options && options.click) {
                    el.click(options.click);
                }
            }
            return el;
        },

        /** Helper to load contacts list */
        loadGrid: function (params, hash, url, options) {
            this.current_category_id = this.current_group_id = this.current_view_id = null;
            if (!url) {
                url = '?module=contacts&action=list';
            }
            if (!options) {
                options = {};
            }
            $.wa.grid.load(url, params, "#contacts-container .contacts-data", hash, options);
        },

        /** Append a message above contacts list. */
        showMessage: function (message, deleteContent) {
            var oldMessages = $('#c-core .wa-message');
            if (deleteContent) {
                oldMessages.remove();
                oldMessages = $();
            }

            if (!message) {
                return;
            }

            var html = $('<div class="wa-message wa-success"><a onclick="$(this).parent().empty().hide();"><i class="icon16 close"></i></a></div>')
                .prepend($('<span class="wa-message-text"></span>').append(message));

            if (oldMessages.size()) {
                $(oldMessages[0]).empty().append(html);
            } else {
                if ($("#c-core h1:first").size()) {
                    html.insertAfter($("#c-core h1:first"));
                } else {
                    $("#c-core").prepend(html);
                }
            }
        },

        /** Change current hash */
        setHash: function (hash) {
            return $.wa.setHash(this.cleanHash(hash));
        },

        /** Current hash */
        getHash: function () {
            return this.cleanHash();
        },

        /** Make sure hash has a # in the begining and exactly one / at the end.
          * For empty hashes (including #, #/, #// etc.) return an empty string.
          * Otherwise, return the cleaned hash.
          * When hash is not specified, current hash is used. */
        cleanHash: function (hash) {
            if(typeof hash == 'undefined') {
                hash = window.location.hash.toString();
            }

            if (!hash.length) {
                hash = ''+hash;
            }
            while (hash.length > 0 && hash[hash.length-1] === '/') {
                hash = hash.substr(0, hash.length-1);
            }
            hash += '/';

            if (hash[0] != '#') {
                if (hash[0] != '/') {
                    hash = '/' + hash;
                }
                hash = '#' + hash;
            } else if (hash[1] && hash[1] != '/') {
                hash = '#/' + hash.substr(1);
            }

            if(hash == '#/') {
                return '';
            }

            return hash;
        },

        /** Helper to switch to particular tab in a tab set. */
        switchToTab: function(tab, onto, onfrom, tabContent) {
            if (typeof(tab) == 'string') {
                if (tab.substr(0, 2) == 't-') {
                    tab = '#'+tab;
                } else if (tab[0] != '#') {
                    tab = "#t-" + tab;
                }
                tab = $(tab);
            } else {
                tab = $(tab);
            }
            if (tab.size() <= 0 || tab.hasClass('selected')) {
                return;
            }

            if (!tabContent) {
                var id = tab.attr('id');
                if (!id || id.substr(0, 2) != 't-') {
                    return;
                }
                tabContent = $('#tc-'+id.substr(2));
            }

            if (onfrom) {
                var oldTab = tab.parent().children('.selected');
                if (oldTab.size() > 0) {
                    oldTab.each(function(k, v) {
                        onfrom.call(v);
                    });
                }
            }

            var doSwitch = function() {
                tab.parent().find('li.selected').removeClass('selected');
                tab.removeClass('hidden').css('display', '').addClass('selected');
                tabContent.siblings('.tab-content').addClass('hidden');
                tabContent.removeClass('hidden');
                if (onto) {
                    onto.call(tab[0]);
                }
            };

            // sliding animation (jquery.effects.core.min.js required)
            if ($.effects && $.effects.slideDIB && !tab.is(':visible')) {
                $.wa.controller.loadTabSlidingAnimation();
                tab.hide().removeClass('hidden').show('slideDIB', {direction: 'down'}, 300, function() {
                    doSwitch();
                });
            } else {
                doSwitch();
            }
        },

        /** Helper to append appropriate events to a checkbox list. */
        initCheckboxList: function(ul) {
            ul = $(ul);

            var updateStatus = function(i, cb) {
                var self = $(cb || this);
                if (self.is(':checked')) {
                    self.parent().addClass('highlighted');
                } else {
                    self.parent().removeClass('highlighted');
                }
            };

            ul.find('input[type="checkbox"]')
                .click(updateStatus)
                .each(updateStatus);
            return ul;
        },

        collapseSidebarSection: function(el, action) {
            if (!action) {
                action = 'coollapse';
            }
            el = $(el);
            if(el.size() <= 0) {
                return;
            }

            var arr = el.find('.darr, .rarr');
            if (arr.size() <= 0) {
                arr = $('<i class="icon16 darr">');
                el.prepend(arr);
            }
            var newStatus;
            var id = el.attr('id');
            var oldStatus = arr.hasClass('darr') ? 'shown' : 'hidden';

            var hide = function() {
                el.parent().find('ul.collapsible').hide();
                arr.removeClass('darr').addClass('rarr');
                newStatus = 'hidden';
            };
            var show = function() {
                el.parent().find('ul.collapsible').show();
                arr.removeClass('rarr').addClass('darr');
                newStatus = 'shown';
            };

            switch(action) {
                case 'toggle':
                    if (oldStatus == 'shown') {
                        hide();
                    } else {
                        show();
                    }
                    break;
                case 'restore':
                    if (id) {
                        var status = $.storage.get('contacts/collapsible/'+id);
                        if (status == 'hidden') {
                            hide();
                        } else {
                            show();
                        }
                    }
                    break;
                case 'uncollapse':
                    show();
                    break;
                //case 'collapse':
                default:
                    hide();
                    break;
            }

            // save status in persistent storage
            if (id && newStatus) {
                $.storage.set('contacts/collapsible/'+id, newStatus);
            }
        },

        /** Collapse sections in sidebar according to status previously set in $.storage */
        restoreCollapsibleStatusInSidebar: function() {
            $("#wa-app .collapse-handler").each(function(i,el) {
                $.wa.controller.collapseSidebarSection(el, 'restore');
            });
        },

        /** Gracefully reload sidebar. */
        reloadSidebar: function() {
            $.post("?module=backend&action=sidebar", null, function (response) {
                var sb = $("#wa-app .sidebar");
                sb.css('height', sb.height()+'px') // prevents blinking in some browsers
                  .html(response)
                  .css('height', '');
                $.wa.controller.highlightSidebar();
                $.wa.controller.restoreCollapsibleStatusInSidebar();
                if ($.wa.controller.initSidebarDragAndDrop) {
                    $.wa.controller.initSidebarDragAndDrop();
                }
            });
        },

        /** Add .selected css class to li with <a> whose href attribute matches current hash.
          * If no such <a> found, then the first partial match is highlighted.
          * Hashes are compared after this.cleanHash() applied to them. */
        highlightSidebar: function() {
            var currentHash = this.cleanHash(location.hash);
            var partialMatch = false;
            var match = false;
            $('#wa-app .sidebar li a').each(function(k, v) {
                v = $(v);
                var h = $.wa.controller.cleanHash(v.attr('href'));

                // Perfect match?
                if (h == currentHash) {
                    match = v;
                    return false;
                }

                // Partial match? (e.g. for urls that differ in paging only)
                if (!partialMatch && h.length > 2 && currentHash.substr(0, h.length) === h) {
                    partialMatch = v;
                }
            });

            if (!match && partialMatch) {
                match = partialMatch;
            }

            if (match) {
                $('#wa-app .sidebar .selected').removeClass('selected');

                // Only highlight items that are outside of dropdown menus
                if (match.parents('ul.dropdown').size() <= 0) {
                    var p = match.parent();
                    while(p.size() > 0 && p[0].tagName.toLowerCase() != 'li') {
                        p = p.parent();
                    }
                    if (p.size() > 0) {
                        p.addClass('selected');
                    }
                }
            }
        },

        // Custom sliding animation to hide and show tabs
        loadTabSlidingAnimation: function() {
            if ($.effects && !$.effects.slideDIB) {
                $.effects.slideDIB = function(o) {
                    return this.queue(function() {
                        // Create element
                        var el = $(this), props = ['position','top','left','width','height','margin'];

                        // Set options
                        var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
                        var direction = o.options.direction || 'left'; // Default Direction

                        // Adjust
                        $.effects.save(el, props); el.show(); // Save & Show
                        $.effects.createWrapper(el).css({overflow:'hidden',display: 'inline-block',width:'auto'}); // Create Wrapper
                        var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
                        var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
                        var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) : el.outerWidth({margin:true}));
                        if (mode == 'show') {
                            el.css(ref, motion == 'pos' ? -distance : distance); // Shift
                        }

                        // Animation
                        var animation = {};
                        animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

                        // Animate
                        el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
                            if(mode == 'hide') {
                                el.hide(); // Hide
                            }
                            $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
                            if(o.callback) {
                                o.callback.apply(this, arguments); // Callback
                            }
                            el.dequeue();
                        }});
                    });
                }; // end of $.effects.slideDIB
            }
        }
    }; // end of $.wa.controller
})(jQuery);
;
(function($) {
    $.wa.grid = {
        init: function (config) {
            if (config) {
                this.config = config;
            }
            this.defaultSettings = {limit: 30, offset: 0, sort: 'name', order: 1, view: 'table'};
            this.settings = $.extend({}, this.defaultSettings);
            this.fields = [
                {id: 'photo', title: $_('Photo'), // attrs: '',
                    filter: function (data) {
                        var src;
                        if (!data.photo || data.photo == '0') {
                            src = $.wa.controller.options.url+'wa-content/img/userpic96.jpg';
                        } else if (''+parseInt(data.photo) == data.photo) {
                            src = $.wa.controller.options.url+'wa-data/public/contacts/photo/'+data.id+'/'+data.photo+'.96x96.jpg';
                        } else {
                            src = data.photo;
                        }
                        return '<div class="image"><a href="#/contact/'+data.id+'"><img src="' + src + '" /></a></div>';
                    }
                },
                {id: 'f', title: 'Field', filter: function (data, options) {
                    var h = options.hash.replace(/duplicates/, 'search');
                    return '<a href="#' + h.substr(0, h.length - 1) + '=' + encodeURIComponent(data.f) +'/0/~data/0/list/">'+ data.f + '</a>';
                }, sorted: true},
                {id: 'n', title: 'Number', sorted: true}
            ];

            for (var field_id in this.config.fields) {
                f = {
                    id: field_id,
                    title: this.config.fields[field_id].name
                };
                if (field_id == 'email') {
                    f.filter = function (d, p) {
                        if (p && p.value) {
                            return '<a href="mailto:' + encodeURIComponent(p.value.value || p.value) + '">' + $.wa.encodeHTML(p.value.value || p.value) + '</a>';
                        } else {
                            return '';
                        }
                    };
                    f.attrs = 'class="alist"';
                } else if (field_id == 'company') {
                    f['filter'] = function (data) {
                        if (data.company && !$.wa.controller.free) {
                            return '<a href="#/contacts/search/company=' + encodeURIComponent(data.company) + '/">' + $.wa.encodeHTML(data.company) + '</a>';
                        } else {
                            return $.wa.encodeHTML(data.company);
                        }
                    };
                    f['sorted'] = true;
                } else if (field_id == 'name') {
                    f['attrs'] = 'class="wa-c-name"';
                    f['filter'] = function (data) {
                        return '<a href="#/contact/'+ data.id +'">'+ $.wa.encodeHTML(data.name || '') + '</a>';
                    };
                    f['sorted'] = true;
                }
                this.fields.push(f);
            }

            this.fields.push({
                id: '_access',
                title: $_('Access'),
                filter: function(data) {
                    if (data._access == 'admin') {
                        return '<strong>'+$_('Administrator')+'</strong>';
                    } else if (!data._access) {
                        return '<span style="color: red; white-space: nowrap">'+$_('No access')+'</span>';
                    } else if (data._access == 'custom') {
                        return '<span style="white-space: nowrap">'+$_('Limited access')+'</span>';
                    } else {
                        return data._access; // not used and should not be
                    }
                }
            });
            this.fields.push({
                id: '_online_status', title: '',
                filter: function (data) {
                    switch (data._online_status) {
                        case 'online':
                            return '<i class="icon10 online"></i>';
                        default: // 'offline', 'not-complete'
                            return '';
                    }
                }
            });

            // Since 'change' does not propagate in IE, we cannot use it with live events.
            // In IE have to use 'click' instead.
            var that = this;
            $('#records-per-page').die($.browser.msie ? 'click' : 'change');
            $('#records-per-page').live($.browser.msie ? 'click' : 'change', function() {
                var newLimit = $(this).val();
                var newOffset = 0;

                // Change offset correctly
                if(that.settings && that.settings.offset) {
                    newOffset = Math.floor(that.settings.offset / newLimit)*newLimit;
                }

                $.wa.setHash($.wa.grid.hash + $.wa.grid.getHash({limit: newLimit, offset: newOffset}));
            });
        },

        load: function (url, ps, elem, hash, options) {
            this.url = url;
            this.options = options;
            this.hash = hash;
            this.settings = $.extend({}, this.defaultSettings);
            var active_fields = ['id', 'name', 'email', 'company'];
            for (var n in ps) {
                if (n != 'fields') {
                    if (ps[n] !== null) {
                        this.settings[n] = ps[n];
                    }
                } else {
                    active_fields = ps[n];
                }
            }
            if (typeof active_fields != 'string' && active_fields.join) {
                this.settings.fields = active_fields.join(',');
            } else {
                this.settings.fields = active_fields;
            }
            var self = this;
            var r = Math.random();
            $.wa.controller.random = r; // prevents a lost request from updating a page

            $.post(url, this.settings, function (response) {
                if ($.wa.controller.random != r || response.status != 'ok') {
                    return false;
                }

                // if there's no contacts on current page, but there are contacts in this view
                // then we need to change current page
                if (response.data.count && response.data.contacts && !response.data.contacts.length) {
                    var newOffset = Math.floor((response.data.count-1)/self.settings.limit)*self.settings.limit;
                    if (newOffset != self.settings.offset) {
                        $.wa.setHash($.wa.grid.hash + $.wa.grid.getHash({offset: newOffset}));
                    }
                    return false;
                }

                if (self.options && self.options.beforeLoad) {
                    self.options.beforeLoad.call($.wa.controller, response.data);
                }
                $("#contacts-container .tools-view li.selected").removeClass('selected');
                $("#contacts-container .tools-view li[rel=" + self.settings.view + "]").addClass('selected');

                if (response.data.title) {
                    $.wa.controller.setTitle(response.data.title);
                }
                if (response.data.desc) {
                    $.wa.controller.setDesc(response.data.desc);
                }
                if (response.data.fields) {
                    active_fields = response.data.fields;
                }

                // Update history
                if (response.data.history) {
                    $.wa.history.updateHistory(response.data.history);
                }

                elem = $(elem);
                elem.html(self.view(self.settings.view, response.data, active_fields));
                if (!options.hide_head) {
                    var pre = self.topLineHtml(self.settings.view);
                    if (pre) {
                        elem.before($(pre));
                    }
                }
                if (self.options && self.options.afterLoad) {
                    self.options.afterLoad(response.data);
                }
            }, "json");
        },

        getSelected: function () {
            var data = new Array();
            $("input.selector:checked").each(function () {
                data.push(this.value);
            });
            return data;
        },

        setView: function (view) {
            $.wa.setHash(this.hash + this.getHash({view: view}));
            return false;
        },

        selectItems: function (obj) {
            if ($(obj).is(":checked")) {
                $('#contacts-container').find('input.selector').attr('checked', 'checked').parents('.contact-row').addClass('selected');
            } else {
                $('#contacts-container').find('input.selector').removeAttr('checked').parents('.contact-row').removeClass('selected');
            }
            $.wa.controller.updateSelectedCount();
        },

        viewtable: function (data, active_fields) {
            var html = '<table class="zebra full-width bottom-bordered">' +
            '<thead><tr>' +
            '<th class="wa-check-td min-width"><input onclick="$.wa.grid.selectItems(this)" type="checkbox" /></th>' +
            '<th class="min-width"></th>';
            for (var i = 0; i < this.fields.length; i++) {
                if (active_fields.indexOf(this.fields[i].id) == -1) continue;
                if (this.fields[i].sorted) {
                    var p = {sort: this.fields[i].id, order: 1};
                    if (this.settings.sort == p.sort) {
                        p.order = 1 - this.settings.order;
                    }

                    html += '<th><a style="white-space:nowrap" href="#' + this.hash + this.getHash(p) + '">' +
                    this.fields[i].title +
                        (this.settings.sort == p.sort ?
                            (p.order ?
                                ' <i class="icon10 darr"></i>' :
                                ' <i class="icon10 uarr"></i>') :
                            '') +
                        '</a></th>';
                } else {
                    html += '<th>' + this.fields[i].title + '</th>';
                }
            }
            html += '</tr></thead>';
            for (var i = 0; i < data.contacts.length; i++) {

                var contact = data.contacts[i];
                html += '<tr class="contact-row">' +
                '<td><input class="selector" type="checkbox" value="' + contact.id + '" /></td>' +
                '<td></td>';
                for (var j = 0; j < this.fields.length; j++) {
                    if (active_fields.indexOf(this.fields[j].id) == -1) continue;
                    var v = contact[this.fields[j].id];
                    if (v == undefined) {
                        v = '';
                    } else if (typeof(v) == 'object') {
                        var temp_v = [];
                        for (var l = 0; l < v.length; l++) {
                            if (typeof(v[l]) == 'object') {
                                temp_v.push('<span title="' + v[l].ext + '">' + (this.fields[j].filter ? this.fields[j].filter(contact, {hash: this.hash, value: v[l].value}) : v[l].value) + '</span>');
                            } else {
                                temp_v.push($.trim(this.fields[j].filter ? this.fields[j].filter(contact, {hash: this.hash, value: v[l]}) : v[l]));
                            }
                        }
                        v = temp_v.join(', ');
                    } else if (this.fields[j].filter) {
                        v = this.fields[j].filter(contact, {hash: this.hash, value: v});
                    } else {
                        v = $.wa.encodeHTML(v);
                    }
                    html += '<td '+ (this.fields[j].attrs ? this.fields[j].attrs : '') +'>' + v + '</td>';
                }
                html += '</tr>';
            }
            html += '</table>';
            html += this.getPaging(data.count);
            return html;
        },

        getFieldById: function (id) {
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].id == id) {
                    return this.fields[i];
                }
            }
            return {};
        },

        topLineHtml: function(view) {
            if (view != 'list' && view != 'thumbs') {
                return '';
            }

            var html = '<div class="c-list-top-line"><input onclick="$.wa.grid.selectItems(this)" type="checkbox"><span>'+$_('Sort by')+':</span>';

            // Sort options
            var names = {
                'name': $_('Name'),
                'company': $_('Company')
            };
            for(var k in names) {
                var p = {sort: k, order: 1};
                if (this.settings.sort == p.sort) {
                    p.order = 1 - this.settings.order;
                }
                html += '<a href="#' + this.hash + this.getHash(p) + '">'+
                            names[k]+
                            (this.settings.sort == p.sort ?
                                (p.order ?
                                    '<i class="icon10 darr"></i>' :
                                    '<i class="icon10 uarr"></i>')
                                : '')+
                        '</a>';
            }
            return html;
        },

        viewthumbs: function (data) {
            $("#contacts-container .contacts-data").removeClass('not-padded').addClass('padded');
            var html = '<ul class="thumbs li100px">';
            for (var i = 0; i < data.contacts.length; i++) {
                var contact = data.contacts[i];

                var f = this.getFieldById('photo');
                var photo = contact.photo;
                if (f.filter) {
                    photo = f.filter(contact, {hash: this.hash, value: photo});
                }
                var url = '#/contact/' + contact.id;
                name = contact.name;
                f = this.getFieldById('name');
                if (f.filter) {
                    name = f.filter(contact, {hash: this.hash, value: name});
                }

                // The item must be inside .contact-row container. When selected, .contact-row
                // becomes .contact-row.selected (code in $.wa.grid.selectItems() and $.wa.controller.init())
                html += '<li class="contact-row">' +
                photo +
                '<div class="c-name-check"><input class="selector" value="' + contact.id + '" type="checkbox"><a href="'+url+'">' + name + '</a></div>' +
                '<div class="status"></div>' +
                '</li>';
            }
            html += '</ul>';
            html += this.getPaging(data.count);
            return html;
        },

        viewlist: function (data) {
            $("#contacts-container .contacts-data").removeClass('padded').addClass('not-padded');
            var html = '<ul class="zebra">';
            for (var i = 0; i < data.contacts.length; i++) {
                var f = this.getFieldById('photo');
                contact = data.contacts[i];
                var photo = contact.photo;
                if (f.filter) {
                    photo = f.filter(contact, {hash: this.hash, value: photo});
                }
                name = contact.name;
                f = this.getFieldById('name');
                if (f.filter) {
                    name = f.filter(contact, {hash: this.hash, value: name});
                }
                var url = '#/contact/' + contact.id;
                html += '<li class="contact-row"><div class="profile image96px">' + photo +
                '<div class="details"><input class="selector" name="c_list_selector" value="' + contact.id + '" type="'+(this.options.selector == 'radio' ? 'radio' : 'checkbox')+'">' +
                '<p class="contact-name"><a href="'+url+'">' + name + '</a></p>';
                var skip = {
                    title: true,
                    name: true,
                    photo: true,
                    firstname: true,
                    middlename: true,
                    lastname: true,
                    locale: true,
                    timezone: true
                };
                for (var field_id in this.config.fields) {
                    if (skip[field_id]) {
                        continue;
                    }
                    if (!contact[field_id] || contact[field_id] == '0000-00-00' || (typeof contact[field_id].length != 'undefined' && !contact[field_id].length)) {
                        continue;
                    }
                    f = this.config.fields[field_id];

                    if (f.fields) {
                        if (typeof(contact[field_id]) == 'object') {
                            for (var j = 0; j < contact[field_id].length; j++) {
                                html += '<p><span class="c-details-label">' + f['name'];
                                if($.trim(contact[field_id][j].ext)) {
                                    // is it a predefined extension?
                                    if (f.ext && f.ext[contact[field_id][j].ext]) {
                                        html += ' <span>(' + f.ext[contact[field_id][j].ext] + ')</span>';
                                    } else {
                                        html += ' <span>(' + $.wa.encodeHTML(contact[field_id][j].ext) + ')</span>';
                                    }
                                }
                                html += ':</span> ' + this.viewlistvalue(contact[field_id][j], f) + '</p>';
                            }
                        } else {
                            html += '<p><span class="c-details-label">' + f['name'] + ':</span> ' + this.viewlistvalue(contact[field_id], true) + '</p>';
                        }
                    } else {
                        html += '<p><span class="c-details-label">' + f['name'] + ':</span> ';
                        if (typeof(contact[field_id]) == 'object') {
                            v = [];
                            for (var j = 0; j < contact[field_id].length; j++) {
                                v.push(this.viewlistvalue(contact[field_id][j], f));
                            }
                            html += v.join(', ');
                        } else {
                            html += this.viewlistvalue(contact[field_id], f);
                        }
                        html += '</p>';
                    }
                }
                html += '</div></div></li>';

            }
            html += '</ul>';

            if (!this.options.hide_foot) {
                html += this.getPaging(data.count);
            }
            return html;
        },

        viewlistvalue: function (v, f) {
            if (typeof(v) != 'object') {
                return $.wa.encodeHTML(v);
            }

            var html = '';

            // value should be encoded only if there's only value and ext
            var enc = true;
            for(var i in v) {
                if (i != 'ext' && i != 'value') {
                    enc = false;
                    break;
                }
            }

            if (v.value) {
                html += enc ? $.wa.encodeHTML(v.value) : v.value;
            }
            if ($.trim(v.ext) && !f.fields) {
                // is it a predefined extension?
                if (f.ext && f.ext[v.ext]) {
                    html += ' <em class="hint">' + f.ext[v.ext] + '</em>';
                } else {
                    html += ' <em class="hint">' + $.wa.encodeHTML(v.ext) + '</em>';
                }
            }
            return html;
        },

        view: function (view, data, params) {
            if (!this['view' + view]) {
                view = 'table';
            }
            $("#list-views li.selected").removeClass('selected');
            $("#list-views li[rel=" + view + "]").addClass('selected');
            return this['view' + view](data, params);
        },

        getHash: function (ps) {
            var p = {};
            for (var n in this.settings) {
                p[n] = this.settings[n];
            }
            for (var n in ps) {
                p[n] = ps[n];
            }
            var hash = p.offset + '/' + p.sort + '/' + p.order + '/' + p.view + '/' + p.limit + '/';
            return hash;
        },

        getPaging: function (n) {
            var html = '<div class="block paging">';

            // "Show X records on page" selector
            var options = '';
            var o = [30, 50, 100, 200, 500];
            for(var i = 0; i < o.length; i++) {
                options += '<option value="'+o[i]+'"'+(this.settings.limit == o[i] ? ' selected="selected"' : '')+'>'+o[i]+'</option>';
            }
            html += '<span class="c-page-num">'+$_('Show %s records on a page').replace('%s', '<select id="records-per-page">'+
                    options+
                '</select>')+'</span>';

            // Total number of contacts in view
            html += '<span class="total">'+$_('Contacts')+': '+n+'</span>';

            // Pagination
            var pages = Math.ceil(n / parseInt(this.settings.limit));
            var p = Math.ceil(parseInt(this.settings.offset) / parseInt(this.settings.limit)) + 1;
            if (pages > 1) {
                if (this.hash[this.hash.length-1] != '/') {
                    this.hash += '/';
                }

                html += '<span>'+$_('Pages')+':</span>';
                if (pages == 1) {
                    return '';
                }
                var f = 0;
                for (var i = 1; i <= pages; i++) {
                    if (Math.abs(p - i) < 3 || i < 5 || pages - i < 3) {
                        html += '<a ' + (i == p ? 'class="selected"' : '') + ' href="#' + this.hash + this.getHash({offset: (i - 1) * this.settings.limit}) + '">' + i + '</a>';
                        f = 0;
                    } else if (f++ < 3) {
                        html += '.';
                    }
                }
            }

            // Prev and next links
            if (p > 1) {
                html += '<a href="#' + this.hash + this.getHash({offset: (p - 2) * this.settings.limit}) +	'" class="prevnext"><i class="icon10 larr"></i> '+$_('prev')+'</a>';
            }
            if (p < pages) {
                html += '<a href="#' + this.hash + this.getHash({offset: p * this.settings.limit}) +	'" class="prevnext">'+$_('next')+' <i class="icon10 rarr"></i></a>';
            }

            return html + '</div>';
        }

    };
    //$.wa.grid.init();

})(jQuery);;
$.wa.history = {
	data: null,
	updateHistory: function(historyData) {
		this.data = historyData;
		var searchUl = $('#wa-search-history').empty();
		var creationUl = $('#wa-creation-history').empty();
		var currentHash = $.wa.controller.cleanHash(location.hash);
		for(var i = 0; i < historyData.length; i++) {
			var h = historyData[i];
			h.hash = $.wa.controller.cleanHash(h.hash);
			var li = $('<li rel="'+h.id+'">'+
							(h.cnt >= 0 ? '<span class="count">'+h.cnt+'</span>' : '')+
							'<a href="'+h.hash+'"><i class="icon16 '+h.type+'"></i></a>'+
						'</li>');

			if (h.type == 'search' || h.type == 'import') {
				li.addClass('wa-h-type-search');
			}

			li.children('a').append($('<b>').text(h.name));
			var func;

			if (h.type == 'import') {
				creationUl.append(li);
			} else if (h.type == 'add') {
				// show userpic instead of static icon
				var id = parseInt(li.find('a').attr('href').substr(10)); // e.g. #/contact/1/user/
				var url = $.wa.controller.backend_url + '?action=photo&size=20x20&id='+id;
				url += '&__t='+h.cnt; // h.cnt keeps photo version for this type of history record
				li.find('.icon16').removeClass(h.type).addClass('userpic20').css('background-image', 'url('+url+')');
				creationUl.append(li);
			} else if (h.type == 'search') {
				searchUl.append(li);
			}
		}

		var lists = [searchUl, creationUl];
		for(var l = 0; l < lists.length; l++) {
			var ul = lists[l];
			if (ul.children().size() > 0) {
				ul.parents('.block.wrapper').show();
			} else {
				ul.parents('.block.wrapper').hide();
			}
		}
		$.wa.controller.highlightSidebar();
	},
	clear: function(type) {
		if (!type || type == 'search') {
			$('#wa-search-history').parents('.block.wrapper').hide();
			$('#wa-search-history').empty();
			type = '&ctype='+type
		} else if (type && type == 'creation') {
			$('#wa-creation-history').parents('.block.wrapper').hide();
			$('#wa-creation-history').empty();
			type = '&ctype[]=import&ctype[]=add';
		} else {
			type = '';
		}
		$.get('?module=contacts&action=history&clear=1'+type);
		return false;
	}
};

// EOF;

$.wa.contactEditor = {
	contact_id: null,
	contactType: 'person', // person|company
	baseFieldType: null, // defined in fieldTypes.js
	saveUrl: '?module=contacts&action=save', // URL to send data when saving contact

	/** Editor factory templates, filled below */
	factoryTypes: {
		// 'Type': ... // factory template
	},

	/** Editor factories by field id, filled by this.initFactories() */
	editorFactories: {/*
		...,
		field_id: editorFactory // Factory to get editor for given type from
		...,
	*/},

	/** Fields that we need to show. All fields available for editing or viewing present here
	  * (possibly with empty values). Filled by this.initFieldEditors() */
	fieldEditors: {/*
		...,
		// field_id as specified in field metadata file
		// An editor for this field instance. If field exists, but there's no data
		// in DB, a fully initialized editor with empty values is present anyway.
		field_id: fieldEditor,
		...
	*/},

	/** Empty and reinit this.editorFactories given data from php.
	  * this.factoryTypes must already be set.*/
	initFactories: function(fields) {
		this.editorFactories = {};
		this.fieldEditors = {};
		for(var fldId in fields) {
			if (typeof fields[fldId] != 'object' || !fields[fldId].type) {
				throw new Error('Field data error for '+fldId);
			}

			if (typeof this.factoryTypes[fields[fldId].type] == 'undefined') {
				throw new Error('Unknown factory type: '+fields[fldId].type);
			}

			if (fields[fldId].multi) {
				this.editorFactories[fldId] = $.extend({}, this.factoryTypes['Multifield']);
			} else {
				this.editorFactories[fldId] = $.extend({}, this.factoryTypes[fields[fldId].type]);
			}
			this.editorFactories[fldId].initializeFactory(fields[fldId]);
		}
	},

	/** Init (or reinit existing) editors with empty data. */
	initAllEditors: function() {
		for(var f in $.wa.contactEditor.editorFactories) {
			if (typeof this.fieldEditors[f] == 'undefined') {
				this.fieldEditors[f] = this.editorFactories[f].createEditor();
			} else {
				this.fieldEditors[f].reinit();
			}
		}
	},

	/** Reinit (maybe not all) of this.fieldEditors using data from php. */
	initFieldEditors: function(newData) {
		if (newData instanceof Array) {
			// must be an empty array that came from json
			return;
		}

		for(var f in newData) {
			if (typeof this.editorFactories[f] == 'undefined') {
				// This can happen when a new field type is added since user opened the page.
				// Need to reload. (This should not happen often though.)
				$.wa.controller.contactAction([this.contact_id]);
				//console.log(this.editorFactories);
				//console.log(newData);
				//throw new Error('Unknown field type: '+f);
				return;
			}

			if (typeof this.fieldEditors[f] == 'undefined') {
				this.fieldEditors[f] = this.editorFactories[f].createEditor();
			}
			this.fieldEditors[f].setValue(newData[f]);
		}
	},

	/** Empty #contact-info-block and add editors there in given mode.
	  * this.editorFactories and this.fieldEditors must already be initialized. */
	initContactInfoBlock: function (mode) {
		this.switchMode(mode, true);
	},

	/** Switch mode for all editors */
	switchMode: function (mode, init) {
		var el = $('#contact-info-block');
		if (init) {
			el.html('');
			el.removeClass('edit-mode');
			el.removeClass('view-mode');
		}
		if (mode == 'edit' && el.hasClass('edit-mode')) {
			return;
		}
		if (mode == 'view' && el.hasClass('view-mode')) {
			return;
		}

		// Remove all buttons
		el.find('div.field.buttons').remove();

		var fieldsToUpdate = [];
		for(var f in this.fieldEditors) {
			fieldsToUpdate.push(f);
			var fld = this.fieldEditors[f].setMode(mode);
			if (init) {
				el.append(fld);
			}
		}

		// Editor buttons
		if(mode == 'edit') {
			$('#c-editor-edit-link').hide();

			var buttons = this.inplaceEditorButtons(fieldsToUpdate, function(noValidationErrors) {
				if (typeof noValidationErrors != 'undefined' && !noValidationErrors) {
					return false;
				}

				if (typeof $.wa.contactEditor.justCreated != 'undefined' && $.wa.contactEditor.justCreated) {
					// new contact created
					var c = $('#sb-all-contacts-li .count');
					c.text(1+parseInt(c.text()));

					// Redirect to profile just created
					$.wa.setHash('/contact/'+$.wa.contactEditor.contact_id);
					return false;
				}

				$.wa.contactEditor.switchMode('view');
				$.scrollTo(0);
				return false;
			}, function() {
				if ($.wa.contactEditor.contact_id == null) {
					$.wa.back();
					return;
				}
				$.wa.contactEditor.switchMode('view');
				$.scrollTo(0);
			});
			el.append(buttons);
			el.removeClass('view-mode');
			el.addClass('edit-mode');
		} else {
			$('#c-editor-edit-link').show();
			el.removeClass('edit-mode');
			el.addClass('view-mode');
		}
	},

	/** Save all modified editors, reload data from php and switch back to view mode. */
	saveFields: function(ids, callback) {
		var data = {};
		var validationErrors = false;
		for(var i = 0; i < ids.length; i++) {
			var f = ids[i];
			var err = this.fieldEditors[f].validate();
			if (err) {
				if (!validationErrors) {
					validationErrors = this.fieldEditors[f].domElement;
					// find the first visible parent of the element
					while(!validationErrors.is(':visible')) {
						validationErrors = validationErrors.parent();
					}
				}
				this.fieldEditors[f].showValidationErrors(err);
			} else {
				this.fieldEditors[f].showValidationErrors(null);
			}
			data[f] = this.fieldEditors[f].getValue();
		}

		if (validationErrors) {
			$.scrollTo(validationErrors);
			$.scrollTo('-=100px');
			callback(false);
			return;
		}

		var that = this;
		$.post(this.saveUrl, {
			'data': $.JSON.encode(data),
			'type': this.contactType,
			'id': this.contact_id != null ? this.contact_id : 0
		}, function(newData) {
			if (newData.status != 'ok') {
				throw new Exception('AJAX error: '+$.JSON.encode(newData));
			}

			newData = newData.data;

			if (newData.history) {
				$.wa.history.updateHistory(newData.history);
			}

			if (newData.data && newData.data.top) {
				var html = '';
				for (var j = 0; j < newData.data.top.length; j++) {
					var f = newData.data.top[j];
					var icon = f.id == 'im' ? '' : '<i class="icon16 ' + f.id + '"></i>';
					html += '<li>' + icon + f.value + '</li>';
				}
				$("#contact-info-top").html(html);
				delete newData.data.top;
			}

			if ($.wa.contactEditor.contactType == 'company' && newData.data.name) {
				delete newData.data.name;
			}

			if($.wa.contactEditor.contact_id != null) {
				$.wa.contactEditor.initFieldEditors(newData.data);
			}

			// hide old validation errors and show new if exist
			var validationErrors = false;
			for(var f in that.fieldEditors) {
				if (typeof newData.errors[f] != 'undefined') {
					that.fieldEditors[f].showValidationErrors(newData.errors[f]);
					if (!validationErrors) {
						validationErrors = that.fieldEditors[f].domElement;
						// find the first visible parent of the element
						while(!validationErrors.is(':visible')) {
							validationErrors = validationErrors.parent();
						}
					}
				} else if (that.fieldEditors[f].currentMode == 'edit') {
					that.fieldEditors[f].showValidationErrors(null);
				}
			}

			if (validationErrors) {
				$.scrollTo(validationErrors);
				$.scrollTo('-=100px');
			} else if ($.wa.contactEditor.contact_id && newData.data.reload) {
				window.location.reload();
				return;
			}

			if ($.wa.contactEditor.contact_id == null && !validationErrors) {
				 $.wa.contactEditor.contact_id = newData.data.id;
				 $.wa.contactEditor.justCreated = true;
			}
			callback(!validationErrors);
		}, 'json');
	},

	/** Return jQuery object representing ext selector with given options and currently selected value. */
	createExtSelect: function(options, defValue) {
		var optString = '';
		var custom = true;
		for(var i in options) {
			var selected = '';
			if (options[i] === defValue || i === defValue) {
				selected = ' selected="selected"';
				custom = false;
			}
			var v = this.htmlentities(options[i]);
			optString += '<option value="'+(typeof options.length === 'undefined' ? i : v)+'"'+selected+'>'+v+'</option>';
		}

		var input;
		if (custom) {
			optString += '<option value="%custom" selected="selected">'+$_('other')+'...</option>';
			input = '<input type="text" class="small ext">';
		} else {
			optString += '<option value="%custom">'+$_('other')+'...</option>';
			input = '<input type="text" class="small empty ext">';
		}

		var result = $('<span><select class="ext">'+optString+'</select><span>'+input+'</span></span>');
		var select = result.children('select');
		input = result.find('input');
		input.val(defValue);
		if(select.val() !== '%custom') {
			input.hide();
		}

		defValue = $_('which?');

		var inputOnBlur = function() {
			if(!input.val() && !input.hasClass('empty')) {
				input.val(defValue);
				input.addClass('empty');
			}
		}
		input.blur(inputOnBlur);
		input.focus(function() {
			if (input.hasClass('empty')) {
				input.val('');
				input.removeClass('empty');
			}
		});

		select.change(function() {
			var v = select.val();
			if (v === '%custom') {
				if (input.hasClass('empty')) {
					input.val(defValue);
				}
				input.show();
			} else {
				input.hide();
				input.addClass('empty');
				input.val(v || '');
			}
			inputOnBlur();
		});

		input[0].getExtValue = function() {
			return select.val() === '%custom' && input.hasClass('empty') ? '' : input.val();
		}
		input[0].setExtValue = function(val) {
			if (options[val]) {
				select.val(val);
			} else {
				select.val('%custom');
			}
			input.val(val);
		}

		return result;
	},

	/** Create and return JQuery object with buttons to save given fields.
	  * @param fieldIds array of field ids
	  * @param saveCallback function save handler. One boolean parameter: true if success, false if validation errors occured
	  * @param cancelCallback function cancel button handler. If not specified, then saveCallback() is called with no parameter. */
	inplaceEditorButtons: function(fieldIds, saveCallback, cancelCallback) {
		var buttons = $('<div class="field buttons"><div class="value submit"><em class="errormsg" id="validation-notice"></em></div></div>');

		//
		// Save button and save on enter in input fields
		//
		var saveHandler = function() {
			buttons.find('.loading').show();
			$.wa.contactEditor.saveFields(fieldIds, function(p) {
				buttons.find('.loading').hide();
				saveCallback(p);
			});
			return false;
		};

		// refresh delegated event that submits form when user clicks enter
		var inputs_handler = $('#contact-info-block.edit-mode input[type="text"]', $('#c-core')[0]);
		inputs_handler.die('keyup');
		inputs_handler.live('keyup', function(event) {
			if(event.keyCode == 13){
				saveHandler();
			}
		});
		var saveBtn = $('<input type="submit" class="button green" value="'+$_('Save')+'" />').click(saveHandler);

		//
		// Cancel link
		//
		var that = this;
		var cancelBtn = $('<a href="javascript:void(0)">'+$_('cancel')+'</a>').click(function(e) {
			buttons.find('.loading').hide();
			if (typeof cancelCallback != 'function') {
				saveCallback();
			} else {
				cancelCallback();
			}
			// remove topmost validation errors
			that.fieldEditors.name.showValidationErrors(null);
			$.scrollTo(0);
			return false;
		});
		buttons.children('div.value.submit')
			.append(saveBtn)
			.append(' '+$_('or')+' ')
			.append(cancelBtn)
			.append($('<i class="icon16 loading" style="margin-left: 16px; display: none;"></i>'));
		return buttons;
	},

	/** Utility function for common name => value wrapper.
	  * @param value	string|JQuery string to place in Value column, or a jquery collection of .value divs (possibly wrapped by .multifield-subfields)
	  * @param name	 string string to place in Name column (defaults to '')
	  * @param cssClass string optional CSS class to add to wrapper (defaults to none)
	  * @return resulting HTML
	  */
	wrapper: function(value, name, cssClass) {
		cssClass = (typeof cssClass != 'undefined') && cssClass ? ' '+cssClass : '';
		var result = $('<div class="field'+cssClass+'"></div>');

		if ((typeof name != 'undefined') && name) {
			result.append('<div class="name">'+name+'</div>');
		}

		if (typeof value != 'object' || !(value instanceof jQuery) || value.find('div.value').size() <= 0) {
			value = $('<div class="value"></div>').append(value);
		}
		result.append(value);
		return result;
	},

	/** Convert html special characters to entities. */
	htmlentities: function(s){
		var div = document.createElement('div');
		var text = document.createTextNode(s);
		div.appendChild(text);
		return div.innerHTML;
	}
}; // end of $.wa.contactEditor

// EOF
;
/**
  * Base classs for all editor factory types, all editor factories and all editors.
  * Implements JS counterpart of contactsFieldEditor with no validation.
  *
  * An editor factory can be created out of factory type (see $.wa.contactEditor.initFactories())
  *
  * Editor factories create editors using factory.createEditor() method. Under the hood
  * a factory simply copies self, removes .createEditor() method from the copy and calls
  * its .initialize() method.
  */
$.wa.contactEditor.baseFieldType = {

    //
    // Public editor factory functions. Not available in editor instances.
    //

    /** For multifields, return a new (empty) editor for this field. */
    createEditor: function() {
        var result = $.extend({}, this);
        delete result.createEditor; // do not allow to use instance as a factory
        delete result.initializeFactory;
        result.parentEditorData = {};
        result.initialize();
        return result;
    },

    //
    // Editor properties set in subclasses.
    //

    /** Last value set by setValue() (or constructor).
      * Default implementation expects fieldValue to be string.
      * Subclasses may store anything here. */
    fieldValue: '',

    //
    // Editor functions that should be redefined in subclasses
    //

    /** Factory constructor. */
    initializeFactory: function(fieldData) {
        this.fieldData = fieldData;
    },

    /** Editor constructor. Should set all appropriate fields as if
      * this.setValue() got called with an empty data (with no record in db).
      * this.fieldData is available for standalone fields,
      * or empty {} for subfields of a multifield. */
    initialize: function() {
        this.setValue('');
    },

    reinit: function() {
        this.currentMode = 'null';
        this.initialize();
    },

    /** Load field contents from given data and update DOM. */
    setValue: function(data) {
        this.fieldValue = data;
        if (this.currentMode == 'null' || this.domElement === null) {
            return;
        }

        if (this.currentMode == 'edit') {
            this.domElement.find('.val').val(this.fieldValue);
        } else {
            this.domElement.find('.val').html(this.fieldValue);
        }
    },

    /** Get data from this field after (possible) user modifications.
      * @return mixed Data object as accepted by this.setValue() and server-side handler. */
    getValue: function() {
        var result = this.fieldValue;
        if (this.currentMode == 'edit' && this.domElement !== null) {
            var input = this.domElement.find('.val');
            if (input.length > 0) {
                result = '';
                if (!input.hasClass('empty')) { // default values use css class .empty to grey out value
                    if (input.attr('type') != 'checkbox' || input.attr('checked')) {
                        result = input.val();
                    }
                }
            }
        }
        return result;
    },

    /** true if this field was modified by user and now needs to save data */
    isModified: function() {
        return this.fieldValue != this.getValue();
    },

    /** Validate field value (and possibly change it if needed)
      * @param boolean skipRequiredCheck (default false) set to true to skip check required fields to be not empty
      * @return mixed Validation data accepted by showValidationErrors(), or null if no errors. Default implementation accepts simple string. */
    validate: function(skipRequiredCheck) {
        var val = this.getValue();
        if (!skipRequiredCheck && this.fieldData.required && !val) {
            return $_('This field is required.');
        }
        return null;
    },

    /** Return a new jQuery object that represents this field in given mode.
      * Use of $.wa.contactEditor.wrapper is recommended if apropriate.
      * In-place editors are initialized here.
      * Must contain exactly one element, even when field is currently not visible.
      * Default implementation uses this.newInlineFieldElement(), wraps it and initializes in-place editor.
      */
    newFieldElement: function(mode) {
        if(this.fieldData.read_only) {
            mode = 'view';
        }
        var inlineElement = this.newInlineFieldElement(mode);

        // Do not show anything if there's no inline element
        if(inlineElement === null && (!this.fieldData.show_empty || mode == 'edit')) {
            return $('<div style="display: none"></div>');
        }

        var nameAddition = '';
        if (mode == 'edit') {
            nameAddition = (this.fieldData.required ? '<span class="req-star">*</span>' : '')+':';
        }

        return $.wa.contactEditor.wrapper(inlineElement, this.fieldData.name+nameAddition);
    },

    /** When used as a part of multi or composite field, corresponding wrapper
      * uses this function (if defined and not null) instead of newFieldElement().
      * Unwrapped value (but still $(...) wrapped) is expected. If null returned, field is not shown.
      */
    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }
        var result = null;
        if (mode == 'edit') {
            result = $('<span><input class="val" type="text"></span>');
            result.find('.val').val(this.fieldValue);
        } else {
            result = $('<span class="val"></span>');
            result.text(this.fieldValue);
        }
        return result;
    },

    /** Remove old validation errors if any and show given error info for this field.
      * Optional to redefine in subclasses.
      * Must be redefined for editors that do not use the default $.wa.contactEditor.wrapper().
      * Default implementation accepts simple string.
      * @param errors mixed Validation error data as generated by this.validate() (or server), or null to hide all errors. */
    showValidationErrors: function(errors) {
        if (this.domElement === null) {
            return;
        }

        var input = this.domElement.find('.val');
        input.parents('.value').children('em.errormsg').remove();

        if (errors !== null) {
            input.parents('.value').append($('<em class="errormsg">'+errors+'</em>'));
            input.addClass('error');
        } else {
            input.removeClass('error');
        }
    },

    //
    // Public properties that can be used in editors
    //

    /** Field data as returned from $typeClass->getValue() for this class in PHP.
      * When this field is a subfield for a multifield, this var contains
      * {id: null, multi: false, name: 'Subfield Name'} */
    fieldData: null,

    /** jQuery object that contains wrapping DOM element that currently
      * represents this field in #contact-info-block. When not null,
      * always contains exactly one element, even if field is currently not visible. */
    domElement: null,

    /** Is domElement in 'view', 'edit' or 'null' mode. */
    currentMode: 'null',

    /** Editor that uses this one as a subfield */
    parentEditor: null,

    /** Any data that parent would want to put here. */
    parentEditorData: null,

    //
    // Public editor functions
    //

    /** Set given editor mode and return DOM element that represents this field.
      * If this editor is already initialized (i.e. this.currentMode is not 'null'),
      * this function replaces old this.domElement in DOM with new value.
      * @param mode string 'edit' or 'view'
      * @param replaceEditor boolean (optional, default true) pass false to avoid creating dom element (e.g. to use as a subfield)
      */
    setMode: function(mode, replaceEditor) {
        if (typeof replaceEditor == 'undefined') {
            replaceEditor = true;
        }
        if (mode != 'view' && mode != 'edit') {
            throw new Error('Unknown mode: '+mode);
        }

        if (this.currentMode != mode) {
            this.currentMode = mode;
            if (replaceEditor) {
                var oldDom = this.domElement;
                this.domElement = this.newFieldElement(mode);
                if (oldDom !== null) {
                    oldDom.replaceWith(this.domElement);
                }
            }
        }

        return this.domElement;
    }
}; // end of baseFieldType

//
// Factory Types
//

$.wa.contactEditor.factoryTypes.String = $.extend({}, $.wa.contactEditor.baseFieldType, {
    setValue: function(data) {
        this.fieldValue = data;
        if (this.currentMode == 'null' || this.domElement === null) {
            return;
        }

        if (this.currentMode == 'edit') {
            this.domElement.find('.val').val(this.fieldValue);
        } else {
            this.domElement.find('.val').html(this.fieldValue);
        }
    },

    getValue: function() {
        var result = this.fieldValue;
        if (this.currentMode == 'edit' && this.domElement !== null) {
            var input = this.domElement.find('.val');
            result = '';
            if (!input.hasClass('empty')) { // default values use css class .empty to grey out value
                result = input.val();
            }
        }
        return result;
    },

    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }

        var result = null;
        var value = this.fieldValue;
        if (mode == 'edit') {
            if (this.fieldData.input_height <= 1) {
                result = $('<span><input class="val" type="text"></span>');
            } else {
                result = $('<span><textarea class="val" rows="'+this.fieldData.input_height+'"></textarea></span>');
            }
            result.find('.val').val(value);
        } else {
            result = $('<span class="val"></span>').text(value);
        }
        return result;
    }
});
$.wa.contactEditor.factoryTypes.Text = $.extend({}, $.wa.contactEditor.factoryTypes.String);
$.wa.contactEditor.factoryTypes.Phone = $.extend({}, $.wa.contactEditor.baseFieldType);
$.wa.contactEditor.factoryTypes.Select = $.extend({}, $.wa.contactEditor.baseFieldType, {
    notSet: function() {
        return '&lt;'+(this.fieldData.defaultOption || $_('not set'))+'&gt;';
    },

    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }

        if(mode == 'view') {
            return $('<span class="val"></span>').text(this.fieldData.options[this.fieldValue] || this.fieldValue);
        } else {
            var options = '';
            var selected = false, attrs;
            for(var i = 0; i<this.fieldData.oOrder.length; i++) {
                var id = this.fieldData.oOrder[i];
                if (!selected && id == this.fieldValue && this.fieldValue) {
                    selected = true;
                    attrs = ' selected';
                } else {
                    attrs = '';
                }
                if (id === '') {
                    attrs += ' disabled';
                }
                options += '<option value="'+id+'"'+attrs+'>'+this.fieldData.options[id]+'</option>';
            }
            return $('<div><select class="val"><option value=""'+(selected ? '' : ' selected')+'>'+this.notSet()+'</option>'+options+'</select></div>');
        }
    }
});
$.wa.contactEditor.factoryTypes.Conditional = $.extend({}, $.wa.contactEditor.factoryTypes.Select, {

    unbindEventHandlers: function() {},

    getValue: function() {
        var result = this.fieldValue;
        if (this.currentMode == 'edit' && this.domElement !== null) {
            var input = this.domElement.find('.val:visible');
            if (input.length > 0) {
                if (input.hasClass('empty')) {
                    result = '';
                } else {
                    result = input.val();
                }
            }
        }
        return result;
    },

    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }
        this.unbindEventHandlers();

        if(mode == 'view') {
            return $('<div></div>').append($('<span class="val"></span>').text((this.fieldData.options && this.fieldData.options[this.fieldValue]) || this.fieldValue));
        } else {
            var cond_field = this;

            // find the the field we depend on
            var parent_field_id_parts = (cond_field.fieldData.parent_field || '').split(':');
            var parent_field = $.wa.contactEditor.fieldEditors[parent_field_id_parts.shift()];
            while (parent_field && parent_field_id_parts.length) {
                subfields = parent_field.subfieldEditors;
                if (subfields instanceof Array) {
                    // This is a multi-field. Select the one that we're part of (if any)
                    parent_field = null;
                    for (var i = 0; i < subfields.length; i++) {
                        if (subfields[i] === cond_field.parentEditor) {
                            parent_field = subfields[i];
                            break;
                        }
                    }
                } else {
                    // This is a composite field. Select subfield by the next id part
                    parent_field = subfields[parent_field_id_parts.shift()];
                }
            }

            if (parent_field) {
                var initial_value = (this.fieldData.options && this.fieldData.options[this.fieldValue]) || this.fieldValue;
                var input = $('<input type="text" class="hidden val">').val(initial_value);
                var select = $('<select class="hidden val"></select>').hide();
                var change_handler;

                var getVal = function() {
                    if (input.is(':visible')) {
                        return input.val();
                    } else if (select.is(':visible')) {
                        return select.val();
                    } else {
                        return initial_value;
                    }
                };

                // Listen to change events from field we depend on.
                // setTimeout() to ensure that field created its new domElement.
                setTimeout(function() {
                    if (!parent_field.domElement) {
                        input.show();
                        return;
                    }
                    parent_field.domElement.on('change', '.val', change_handler = function() {
                        var parent_val_element = $(this);
                        var old_val = getVal();
                        var parent_value = (parent_val_element.val() || '').toLowerCase();
                        var values = cond_field.fieldData.parent_options[parent_value];
                        if (values) {
                            input.hide();
                            select.show().children().remove();
                            for (i = 0; i < values.length; i++) {
                                select.append($('<option></option>').attr('value', values[i]).text(values[i]).attr('selected', cond_field.fieldValue == values[i]));
                            }
                            select.val(old_val);
                        } else {
                            input.val(old_val || '').show().blur();
                            select.hide();
                        }
                    });
                    change_handler.call(parent_field.domElement.find('.val:visible')[0]);
                }, 0);

                cond_field.unbindEventHandlers = function() {
                    if (change_handler && parent_field.domElement) {
                        parent_field.domElement.find('.val').unbind('change', change_handler);
                    }
                    cond_field.unbindEventHandlers = function() {};
                };

                return $('<div></div>').append(input).append(select);
            } else {
                return $('<div></div>').append($('<input type="text" class="val">').val(cond_field.fieldValue));
            }
        }
    }
});
$.wa.contactEditor.factoryTypes.Region = $.extend({}, $.wa.contactEditor.factoryTypes.Select, {
    notSet: function() {
        if (this.fieldData.options && this.fieldValue && !this.fieldData.options[this.fieldValue]) {
            return this.fieldValue;
        }
        return '&lt;'+$_('select region')+'&gt;';
    },

    unbindEventHandlers: function() {},

    setCurrentCountry: function() {
        var old_country = this.current_country;
        this.current_country = this.parentEditorData.parent.subfieldEditors.country.getValue();
        if (old_country !== this.current_country) {
            delete this.fieldData.options;
            return true;
        }
        return false;
    },

    getRegionsControllerUrl: function(country) {
        return ($.wa.contactEditor.regionsUrl || '?module=backend&action=regions&country=')+country;
    },

    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }

        this.unbindEventHandlers();

        if(mode == 'view') {
            return $('<div></div>').append($('<span class="val"></span>').text((this.fieldData.options && this.fieldData.options[this.fieldValue]) || this.fieldValue));
        } else {
            var region_field = this;

            // This field depends on currently selected country in address
            if (this.parentEditorData.parent && this.parentEditorData.parent.subfieldEditors.country) {
                this.setCurrentCountry();
                var handler;
                $('#contact-info-block').on('change', 'select', handler = function() {
                    if (region_field.setCurrentCountry()) {
                        region_field.domElement.empty().append(region_field.newInlineFieldElement(mode).children());
                    }
                });
                region_field.unbindEventHandlers = function() {
                    $('#contact-info-block').off('change', 'select', handler);
                    region_field.unbindEventHandlers = function() {};
                };
            }

            if (this.fieldData.options === undefined && this.current_country && this.fieldData.region_countries[this.current_country]) {
                // Load list of regios via AJAX and then show select
                var country = this.current_country;
                $.get(this.getRegionsControllerUrl(country), function(r) {
                    if (mode !== region_field.currentMode || country !== region_field.current_country) {
                        return;
                    }
                    region_field.fieldData.options = r.data.options || false;
                    region_field.fieldData.oOrder = r.data.oOrder || [];
                    region_field.domElement.empty().append(region_field.newInlineFieldElement(mode).children());
                }, 'json');
                return $('<div></div>').append($('<i class="icon16 loading"></i>'));
            } else if (this.fieldData.options) {
                // Show as select
                return $('<div></div>').append($.wa.contactEditor.factoryTypes.Select.newInlineFieldElement.call(this, mode));
            } else {
                // show as input
                var result = $('<div></div>').append($.wa.contactEditor.baseFieldType.newInlineFieldElement.call(this, mode));
                $.wa.defaultInputValue(result.find('.val'), this.fieldData.name+(this.fieldData.required ? ' ('+$_('required')+')' : ''), 'empty');
                return result;
            }
        }
    }
});

$.wa.contactEditor.factoryTypes.Country = $.extend({}, $.wa.contactEditor.factoryTypes.Select);
$.wa.contactEditor.factoryTypes.Checklist = $.extend({}, $.wa.contactEditor.baseFieldType, {
    validate: function(skipRequiredCheck) {
        if (!skipRequiredCheck && this.fieldData.required && this.getValue().length <= 0) {
            return $_('This field is required.');
        }
        return null;
    },
    setValue: function(data) {
        this.fieldValue = data;

        if(this.currentMode == 'edit' && this.domElement) {
            this.domElement.find('input[type="checkbox"]').attr('checked', false);
            for (var id in this.fieldValue) {
                this.domElement.find('input[type="checkbox"][value="'+id+'"]').attr('checked', true);
            }
        } else if (this.currentMode == 'view' && this.domElement) {
            this.domElement.find('.val').html(this.getValueView());
        }
    },
    getValue: function() {
        if(this.currentMode != 'edit' || !this.domElement) {
            return this.fieldValue;
        }

        var result = [];
        this.domElement.find('input[type="checkbox"]:checked').each(function(k,input) {
            result.push($(input).val());
        });
        return result;
    },
    getValueView: function() {
        var options = '';
        // Show categories in alphabetical (this.fieldData.oOrder) order
        for(var i = 0; i<this.fieldData.oOrder.length; i++) {
            var id = this.fieldData.oOrder[i];
            if (this.fieldValue.indexOf(id) < 0) {
                continue;
            }
            options += (options ? ', ' : '')+'<a href="'+(this.fieldData.hrefPrefix || '#')+id+'">'+((this.fieldData.options[id] && $.wa.contactEditor.htmlentities(this.fieldData.options[id])) || $_('&lt;no name&gt;'))+'</a>';
        }
        return options || $_('&lt;none&gt;');
    },
    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !(this.fieldValue && this.fieldValue.length)) {
            return null;
        }

        if(mode == 'view') {
            return $('<span class="val"></span>').html(this.getValueView());
        }

        //
        // Edit mode
        //

        // Is there more than one option to select from?
        var optionsAvailable = 0; // 0, 1 or 2
        var id;
        for(id in this.fieldData.options) {
            optionsAvailable++;
            if (optionsAvailable > 1) {
                break;
            }
        }
        // Do not show the field at all if there's no options to select from
        if (!optionsAvailable) {
            return null;
        }

        var options = '';
        for(var i = 0; i<this.fieldData.oOrder.length; i++) {
            id = this.fieldData.oOrder[i];
            options += '<li><label><input type="checkbox" value="'+id+'"';

            // the item is checked if EITHER it is present in fieldValue
            // OR if we're showing a form to add new contact and there's only one
            // category available for non-admin
            if (this.fieldValue.indexOf(id-0) >= 0 || (!$.wa.contactEditor.contact_id && $.wa.contactEditor.limitedCategories && optionsAvailable < 2)) {
                options += ' checked="checked"';
            }

            // Checkboxes for system categories are disabled
            if (this.fieldData.disabled && this.fieldData.disabled[id]) {
                options += ' disabled="disabled"';
            }
            options += ' />'+((this.fieldData.options[id] && $.wa.contactEditor.htmlentities(this.fieldData.options[id])) || $_('&lt;no name&gt;'))+'</label></li>';
        }

        return $.wa.controller.initCheckboxList('<div class="c-checkbox-menu-container val"><div><ul class="menu-v compact with-icons c-checkbox-menu">'+options+'</ul></div></div>');
    }
});
$.wa.contactEditor.factoryTypes.Name = $.extend({}, $.wa.contactEditor.baseFieldType, {
    /** Cannot be used inline */
    newInlineFieldElement: null,

    newFieldElement: function(mode) {
        var title = '';
        if ($.wa.contactEditor.fieldEditors.title) {
            title = $.wa.contactEditor.fieldEditors.title.getValue()+' ';
        }
        // Update page header
        $('#contact-fullname').text(''+title+(this.fieldValue ? this.fieldValue : '<'+$_('no name')+'>'));

        // Update browser title
        $.wa.controller.setBrowserTitle($('#contact-fullname').text());

        // Update user name in top right hand corner
        if ($.wa.contactEditor.contact_id && $.wa.contactEditor.contact_id == $.wa.contactEditor.current_user_id) {
            $('#wa-my-username').text(''+(this.fieldValue ? this.fieldValue : '<'+$_('no name')+'>'));
        }

        return $('<div style="display: none"></div>');
    },
    setValue: function(data) {
        this.fieldValue = data;
    },
    getValue: function(forced) {
        if (this.fieldValue && !forced) {
            return this.fieldValue;
        }

        // Have to build it manually for new contacts
        var val = $.wa.contactEditor.fieldEditors.firstname.getValue();
        val += (val ? ' ' : '') + $.wa.contactEditor.fieldEditors.middlename.getValue();
        val += (val ? ' ' : '') + $.wa.contactEditor.fieldEditors.lastname.getValue();
        return val;
    },

    validate: function(skipRequiredCheck) {
        var val = this.getValue(true);
        if (!skipRequiredCheck && this.fieldData.required && !val) {
            // If all name parts are empy then set firstname to be value of the first visible non-empty input:text
            var newfname = $('#contact-info-block input:visible:text[value]:not(.empty)').val();
            if (!newfname) {
                return $_('At least one of these fields must be filled');
            }
            $.wa.contactEditor.fieldEditors.firstname.setValue(newfname);
        }
        return null;
    },

    showValidationErrors: function(errors) {
        var el = $('#contact-info-block');
        el.children('div.wa-errors-block').remove();
        if (errors !== null) {
            var err = $('<div class="field wa-errors-block"><div class="value"><em class="errormsg">'+errors+'</em></div></div>');
            if ($.wa.contactEditor.fieldEditors.lastname) {
                $.wa.contactEditor.fieldEditors.lastname.domElement.after(err);
            } else {
                el.prepend(err);
            }
        }
        var a = ['firstname', 'middlename', 'lastname'];
        for(var i=0; i<a.length; i++) {
            df = a[i];
            if ($.wa.contactEditor.fieldEditors[df]) {
                if (errors !== null) {
                    $.wa.contactEditor.fieldEditors[df].domElement.find('.val').addClass('external-error');
                } else {
                    $.wa.contactEditor.fieldEditors[df].domElement.find('.val').removeClass('external-error');
                }
            }
        }
    }
});

$.wa.contactEditor.factoryTypes.NameSubfield = $.extend({}, $.wa.contactEditor.baseFieldType, {});

$.wa.contactEditor.factoryTypes.Multifield = $.extend({}, $.wa.contactEditor.baseFieldType, {
    subfieldEditors: null,
    subfieldFactory: null,
    emptySubValue: null,

    initializeFactory: function(fieldData) {
        this.fieldData = fieldData;
        if (typeof this.fieldData.ext != 'undefined') {
            this.fieldData.extKeys = [];
            this.fieldData.extValues = [];
            for(var i in this.fieldData.ext) {
                this.fieldData.extKeys[this.fieldData.extKeys.length] = i;
                this.fieldData.extValues[this.fieldData.extValues.length] = this.fieldData.ext[i];
            }
        }
    },

    initialize: function() {
        this.subfieldFactory = $.extend({}, $.wa.contactEditor.factoryTypes[this.fieldData.type]);
        this.subfieldFactory.parentEditor = this;
        this.subfieldFactory.initializeFactory($.extend({}, this.fieldData));
        this.fieldData = $.extend({}, this.fieldData, {'required': this.subfieldFactory.fieldData.required});
        this.subfieldEditors = [this.subfieldFactory.createEditor()];
        if (typeof this.subfieldEditors[0].fieldValue == 'object') {
            this.emptySubValue = $.extend({}, this.subfieldEditors[0].fieldValue);
            if (this.fieldData.ext) {
                this.emptySubValue.ext = this.fieldData.extKeys[0];
            }
        } else {
            this.emptySubValue = {value: this.subfieldEditors[0].fieldValue};
            if (this.fieldData.ext) {
                this.emptySubValue.ext = this.fieldData.extKeys[0];
            }
        }
        this.fieldValue = [this.emptySubValue];
    },

    setValue: function(data) {
        // Check if there's at least one value
        if (!data || typeof data[0] == 'undefined') {
            data = [this.emptySubValue];
        }
        this.fieldValue = data;

        // Update data in existing editors
        // (If there's no data from PHP, still need to have at least one editor. Therefore, do-while.)
        var i = 0;
        do {
            // Add an editor if needed
            if (this.subfieldEditors.length <= i) {
                this.subfieldEditors[i] = this.subfieldFactory.createEditor();
                if (this.currentMode != 'null') {
                    this.subfieldEditors[i].setMode(this.currentMode).insertAfter(this.subfieldEditors[i-1].parentEditorData.domElement);
                }
            }
            if (typeof data[i] != 'undefined') {
                // if data[i] contain only ext and value, then pass value to child;
                // if there's something else, then pass the whole object.
                var passObject = false;
                for(var k in data[i]) {
                    if (k != 'value' && k != 'ext') {
                        passObject = true;
                        break;
                    }
                }

                this.subfieldEditors[i].setValue(passObject ? data[i] : (data[i].value ? data[i].value : ''));

                // save ext
                if (typeof this.fieldData.ext != 'undefined') {
                    var ext = data[i].ext;
                    if (this.currentMode != 'null' && this.subfieldEditors[i].parentEditorData.domElement) {
                        var el = this.subfieldEditors[i].parentEditorData.domElement.find('input.ext');
                        if (el.size() > 0) {
                            el[0].setExtValue(ext);
                        }
                    }
                }
            } else {
                throw new Error('At least one record must exist in data at this time.');
            }
            i++;

        } while(i < data.length);

        // Remove excess editors if needed
        if (data.length < this.subfieldEditors.length) {
            // remove dom elements
            for(i = data.length; i < this.subfieldEditors.length; i++) {
                if (i === 0) { // Never remove the first
                    continue;
                }
                if (this.currentMode != 'null') {
                    this.subfieldEditors[i].parentEditorData.domElement.remove();
                }
            }

            // remove editors
            var a = data.length > 0 ? data.length : 1; // Never remove the first
            this.subfieldEditors.splice(a, this.subfieldEditors.length - a);
        }

        this.origFieldValue = null;
    },

    getValue: function() {
        if (this.currentMode == 'null') {
            return $.extend({}, this.fieldValue);
        }

        var val = [];
        for(var i = 0; i < this.subfieldEditors.length; i++) {
            var sf = this.subfieldEditors[i];
            val[i] = {
                'value': sf.getValue()
            };

            // load ext
            if (typeof this.fieldData.ext != 'undefined') {
                var ext = this.fieldValue[i].ext;
                var el = sf.parentEditorData.domElement.find('input.ext')[0];
                if (sf.currentMode == 'edit' && el) {
                    ext = el.getExtValue();
                }
                val[i].ext = ext;
            }
        }

        return val;
    },

    isModified: function() {
        for(var i = 0; i < this.subfieldEditors.length; i++) {
            var sf = this.subfieldEditors[i];
            if (sf.isModified()) {
                return true;
            }
        }
        return false;
    },

    validate: function(skipRequiredCheck) {
        var result = [];

        // for each subfield add a record subfieldId => its validate() into result
        var allEmpty = true;
        for(var i = 0; i < this.subfieldEditors.length; i++) {
            var sf = this.subfieldEditors[i];
            var v = sf.validate(true);
            if (v) {
                result[i] = v;
            }

            var val = sf.getValue();
            if (val || typeof val != 'string') {
                allEmpty = false;
            }
        }

        if (!skipRequiredCheck && this.fieldData.required && allEmpty) {
            result[0] = 'This field is required.';
        }

        if (result.length <= 0) {
            return null;
        }
        return result;
    },

    showValidationErrors: function(errors) {
        for(var i = 0; i < this.subfieldEditors.length; i++) {
            var sf = this.subfieldEditors[i];
            if (errors !== null && typeof errors[i] != 'undefined') {
                sf.showValidationErrors(errors[i]);
            } else {
                sf.showValidationErrors(null);
            }
        }
    },

    /** Return button to delete subfield. */
    deleteSubfieldButton: function(sf) {
        var that = this;
        var r = $('<a class="delete-subfield hint" href="javascript:void(0)">'+$_('delete')+'</a>').click(function() {
            if (that.subfieldEditors.length <= 1) {
                return false;
            }

            var i = that.subfieldEditors.indexOf(sf);

            // remove dom element
            if (that.currentMode != 'null') {
                that.subfieldEditors[i].parentEditorData.domElement.remove();
            }

            // remove editor
            that.subfieldEditors.splice(i, 1);

            // Hide delete button if only one subfield left
            // have to do this because IE<9 lacks :only-child support
            if (that.subfieldEditors.length <= 1) {
                that.domElement.find('.delete-subfield').hide();
            }

            // (leaves a record in this.fieldValue to be able to restore it if needed)
            return false;
        });

        if (this.subfieldEditors.length <= 1) {
            r.hide();
        }

        return r;
    },

    newSubFieldElement: function(mode, i) {
        i = i-0;
        var sf = this.subfieldEditors[i];
        if(!sf.parentEditorData) {
            sf.parentEditorData = {};
        }
        sf.parentEditorData.parent = this;
        sf.parentEditorData.empty = false;
        var ext;

        // A (composite) field with no inline mode?
        if (typeof sf.newInlineFieldElement != 'function') {
            var nameAddition = '';
            if (mode == 'edit') {
                nameAddition = (this.fieldData.required ? '<span class="req-star">*</span>' : '')+':';
            }
            var wrapper = $.wa.contactEditor.wrapper('<span class="replace-me-with-value"></span>', i === 0 ? (this.fieldData.name+nameAddition) : '', 'no-bot-margins');
            var rwv = wrapper.find('span.replace-me-with-value');

            // extension
            ext = this.fieldValue[i].ext;
            if (mode == 'edit') {
                ext = $.wa.contactEditor.createExtSelect(this.fieldData.ext, ext);
            } else {
                ext = this.fieldData.ext[this.fieldValue[i].ext] || ext;
                ext = $('<strong>'+$.wa.contactEditor.htmlentities(ext)+'</strong>');
            }
            rwv.before(ext);

            // button to delete this subfield
            if (mode == 'edit') {
                rwv.before(this.deleteSubfieldButton(sf));
            }
            rwv.remove();

            sf.domElement = this.subfieldEditors[i].newFieldElement(mode);
            self = this;
            sf.domElement.find('div.name').each(function(i, el) {
                if (el.innerHTML.substr(0, self.fieldData.name.length) === self.fieldData.name) {
                    el.innerHTML = '';
                }
            });

            sf.parentEditorData.domElement = $('<div></div>').append(wrapper).append(sf.domElement);

            //this.initInplaceEditor(sf.parentEditorData.domElement, i);
            return sf.parentEditorData.domElement;
        }

        // Inline mode is available
        var value = sf.newInlineFieldElement(mode);
        if (value === null) {
            // Field is empty, return stub.
            sf.parentEditorData.domElement = sf.domElement = $('<div></div>');
            sf.parentEditorData.empty = true;
            return sf.parentEditorData.domElement;
        }

        sf.domElement = value;
        var result = $('<div class="value"></div>').append(value);
        var rwe = result.find('.replace-with-ext');
        if (rwe.size() <= 0) {
            result.append('<span><span class="replace-with-ext"></span></span>');
            rwe = result.find('.replace-with-ext');
        }

        // Extension
        if (typeof this.fieldData.ext != 'undefined') {
            ext = this.fieldValue[i].ext;
            if (mode == 'edit') {
                rwe.before($.wa.contactEditor.createExtSelect(this.fieldData.ext, ext));
            } else {
                ext = this.fieldData.ext[this.fieldValue[i].ext] || ext;
                if (rwe.parents('.ext').size() > 0) {
                    rwe.before($.wa.contactEditor.htmlentities(ext));
                } else {
                    rwe.before($('<em class="hint"></em>').text(' '+ext));
                }
            }
        }

        // button to delete this subfield
        if (mode == 'edit') {
            rwe.before(this.deleteSubfieldButton(sf));
        }
        rwe.remove();

        sf.parentEditorData.domElement = result;
        //this.initInplaceEditor(sf.parentEditorData.domElement, i);
        return result;
    },

    newInlineFieldElement: null,

    newFieldElement: function(mode) {
        if(this.fieldData.read_only) {
            mode = 'view';
        }

        var childWrapper = $('<div class="multifield-subfields"></div>');
        var inlineMode = typeof this.subfieldFactory.newInlineFieldElement == 'function';

        var allEmpty = true;
        for(var i = 0; i < this.subfieldEditors.length; i++) {
            var result = this.newSubFieldElement(mode, i);
            childWrapper.append(result);
            allEmpty = allEmpty && this.subfieldEditors[i].parentEditorData.empty;
        }

        // do not show anything if there are no values
        if (allEmpty && !this.fieldData.show_empty) {
            return $('<div style="display: none"></div>');
        }

        // Wrap over for all subfields to be in separate div
        var wrapper = $('<div></div>').append(childWrapper);

        // A button to add more fields
        if (mode == 'edit') {
            var adder;
            if (inlineMode) {
                adder = $('<div class="value"><span class="replace-me-with-value"></span></div>');
            } else {
                adder = $.wa.contactEditor.wrapper('<span class="replace-me-with-value"></span>');
            }
            var that = this;
            adder.find('.replace-me-with-value').replaceWith(
                $('<a href="javascript:void(0)" class="small inline-link"><b><i>'+$_('Add another')+'</i></b></a>').click(function (e) {
                    var newLast = that.subfieldFactory.createEditor();
                    var index = that.subfieldEditors.length;

                    val = {
                        value: newLast.getValue(),
                        temp: true
                    };
                    if (typeof that.fieldData.ext != 'undefined') {
                        val.ext = '';
                    }
                    that.fieldValue[index] = val;

                    that.subfieldEditors[index] = newLast;
                    if (that.currentMode != 'null') {
                        newLast.setMode(that.currentMode);
                    }
                    childWrapper.append(that.newSubFieldElement(mode, index));
                    that.domElement.find('.delete-subfield').css('display', 'inline');
                })
            );
            wrapper.append(adder);
        }

        if (inlineMode) {
            var nameAddition = '';
            if (mode == 'edit') {
                nameAddition = (this.fieldData.required ? '<span class="req-star">*</span>' : '')+':';
            }
            wrapper = $.wa.contactEditor.wrapper(wrapper, this.fieldData.name+nameAddition);
        }
        return wrapper;
    },

    setMode: function(mode, replaceEditor) {
        if (typeof replaceEditor == 'undefined') {
            replaceEditor = true;
        }
        if (mode != 'view' && mode != 'edit') {
            throw new Error('Unknown mode: '+mode);
        }

        if (this.currentMode != mode) {
            // When user switches from edit to view, we need to restore
            // deleted editors, if any. So we set initial value here to ensure that.
            if (mode == 'view' && this.currentMode == 'edit' && this.origFieldValue) {
                this.setValue(this.origFieldValue);
            } else if (this.currentMode == 'view' && !this.origFieldValue) {
                this.origFieldValue = [];
                for (var i = 0; i < this.fieldValue.length; i++) {
                    this.origFieldValue.push($.extend({}, this.fieldValue[i]));
                }
            }

            this.currentMode = mode;
            if (replaceEditor) {
                var oldDom = this.domElement;
                this.domElement = this.newFieldElement(mode);
                if (oldDom !== null) {
                    oldDom.replaceWith(this.domElement);
                }
            }
        }

        for(var i = 0; i < this.subfieldEditors.length; i++) {
            this.subfieldEditors[i].setMode(mode, false);
        }

        return this.domElement;
    }
}); // end of Multifield type

$.wa.contactEditor.factoryTypes.Composite = $.extend({}, $.wa.contactEditor.baseFieldType, {
    subfieldEditors: null,

    initializeFactory: function(fieldData) {
        this.fieldData = fieldData;
        if (this.fieldData.required) {
            for(var i in this.fieldData.required) {
                if (this.fieldData.required[i]) {
                    this.fieldData.required = true;
                    break;
                }
            }
            if (this.fieldData.required !== true) {
                this.fieldData.required = false;
            }
        }
    },

    initialize: function() {
        var val = {
            'data': {},
            'value': ''
        };

        this.subfieldEditors = {};
        this.fieldData.subfields = this.fieldData.fields;
        for(var sfid in this.fieldData.subfields) {
            var sf = this.fieldData.subfields[sfid];
            var editor = $.extend({}, $.wa.contactEditor.factoryTypes[sf.type]);
            var sfData = this.fieldData.fields[sfid];
            if (this.fieldData.required && this.fieldData.required[sfid]) {
                sfData.required = true;
            }
            var options = $.extend({}, sfData, {id: null, multi: false});
            editor.initializeFactory(options);
            editor.parentEditor = this;
            editor.parentEditorData = {};
            editor.initialize();
            editor.parentEditorData.sfid = sfid;
            editor.parentEditorData.parent = this;
            this.subfieldEditors[sfid] = editor;
            val.data[sfid] = editor.getValue();
        }

        this.fieldValue = val;
    },

    setValue: function(data) {
        if (!data) {
            return;
        }

        this.fieldValue = data;

        // Save subfields
        for(var sfid in this.subfieldEditors) {
            var sf = this.subfieldEditors[sfid];
            if (typeof data.data == 'undefined') {
                sf.initialize();
                sf.setValue(sf.getValue());
            } else if (typeof data.data[sfid] != 'undefined') {
                sf.setValue(data.data[sfid]);
            } else {
                sf.setValue(sf.getValue());
            }
        }
    },

    getValue: function() {
        if (this.currentMode == 'null') {
            return $.extend({}, this.fieldValue.data);
        }

        var val = {};

        for(var sfid in this.subfieldEditors) {
            var sf = this.subfieldEditors[sfid];
            val[sfid] = sf.getValue();
        }

        return val;
    },

    isModified: function() {
        for(var sfid in this.subfieldEditors) {
            if (this.subfieldEditors[sfid].isModified()) {
                return true;
            }
        }
        return false;
    },

    validate: function(skipRequiredCheck) {
        var result = {};

        // for each subfield add a record subfieldId => its validate() into result
        var errorsFound = false;
        for(var sfid in this.subfieldEditors) {
            var v = this.subfieldEditors[sfid].validate(skipRequiredCheck);
            if (v) {
                result[sfid] = v;
                errorsFound = true;
            }
        }

        if (!errorsFound) {
            return null;
        }
        return result;
    },

    showValidationErrors: function(errors) {
        if (this.domElement === null) {
            return;
        }

        // for each subfield call its showValidationErrors with errors[subfieldId]
        for(var sfid in this.subfieldEditors) {
            var sf = this.subfieldEditors[sfid];
            if (errors !== null && typeof errors[sfid] != 'undefined') {
                sf.showValidationErrors(errors[sfid]);
            } else {
                sf.showValidationErrors(null);
            }
        }
    },

    /** Cannot be used inline */
    newInlineFieldElement: null,

    newFieldElement: function(mode) {
        if(this.fieldData.read_only) {
            mode = 'view';
        }
        if (mode == 'view') {
            // Do not show anything in view mode if field is empty
            if(!this.fieldValue.value && !this.fieldData.show_empty) {
                return $('<div style="display: none"></div>');
            }
        }

        var wrapper = $('<div class="composite '+mode+'"></div>').append($.wa.contactEditor.wrapper('<span style="display:none" class="replace-with-ext"></span>', this.fieldData.name, 'hdr'));

        // For each field call its newFieldElement and add to wrapper
        for(var sfid in this.subfieldEditors) {
            var sf = this.subfieldEditors[sfid];
            var element = sf.newFieldElement(mode);
            sf.domElement = element;
            wrapper.append(element);
        }

        // In-place editor initialization (when not part of a multifield)
        /*if (mode == 'edit' && this.parent == null) {
            var that = this;
            result.find('span.info-field').click(function() {
                var buttons = $.wa.contactEditor.inplaceEditorButtons([that.fieldData.id], function(noValidationErrors) {
                    if (typeof noValidationErrors != 'undefined' && !noValidationErrors) {
                        return;
                    }
                    that.setMode('view');
                    buttons.remove();
                });
                result.after(buttons);
                that.setMode('edit');
            });
        }*/

        return wrapper;
    },

    setMode: function(mode, replaceEditor) {
        if (typeof replaceEditor == 'undefined') {
            replaceEditor = true;
        }
        if (mode != 'view' && mode != 'edit') {
            throw new Error('Unknown mode: '+mode);
        }

        if (this.currentMode != mode) {
            this.currentMode = mode;
            if (replaceEditor) {
                var oldDom = this.domElement;
                this.domElement = this.newFieldElement(mode);
                if (oldDom !== null) {
                    oldDom.replaceWith(this.domElement);
                }
            }
        }

        for(var sfid in this.subfieldEditors) {
            this.subfieldEditors[sfid].setMode(mode, false);
        }

        return this.domElement;
    }
}); // end of Composite field type

$.wa.contactEditor.factoryTypes.Address = $.extend({}, $.wa.contactEditor.factoryTypes.Composite, {
    showValidationErrors: function(errors) {
        if (this.domElement === null) {
            return;
        }

        // remove old errors
        this.domElement.find('em.errormsg').remove();
        this.domElement.find('.val').removeClass('error');

        if (!errors) {
            return;
        }

        // Show new errors
        for(var sfid in this.subfieldEditors) {
            var sf = this.subfieldEditors[sfid];
            if (typeof errors[sfid] == 'undefined') {
                continue;
            }
            var input = sf.domElement.find('.val').addClass('error');
            input.parents('.address-subfield').append($('<em class="errormsg">'+errors[sfid]+'</em>'));
        }
    },

    newInlineFieldElement: function(mode) {
        var result = '';

        if (mode == 'view') {
            // Do not show anything in view mode if field is empty
            if(!this.fieldValue.value) {
                return null;
            }
            return $('<div class="address-field"></div>')
                //.append('<div class="ext"><strong><span style="display:none" class="replace-with-ext"></span></strong></div>')
                .append(this.fieldValue.value)
                .append('<span style="display:none" class="replace-with-ext"></span>');
        }

        //
        // edit mode
        //
        var wrapper = $('<div class="address-field"></div>');
        wrapper.append('<span style="display:none" class="replace-with-ext"></span>');

        // Add fields
        // For each field call its newFieldElement and add to wrapper
        for(var sfid in this.subfieldEditors) {
            var sf = this.subfieldEditors[sfid];
            var element = sf.newInlineFieldElement('edit');
            sf.domElement = element;
            wrapper.append($('<div class="address-subfield"></div>').append(element));
            $.wa.defaultInputValue(element.find('input.val'), sf.fieldData.name+(sf.fieldData.required ? ' ('+$_('required')+')' : ''), 'empty');
        }
        return wrapper;
    }
});

$.wa.contactEditor.factoryTypes.Date = $.extend({}, $.wa.contactEditor.baseFieldType, {

    datepickerOptions: function(element) {
        return {
            altField: element.find('input.val'),
            dateFormat: this.fieldData.format,
            altFormat: 'yy-mm-dd',
            yearRange: '-99:+1',
            changeYear: true,
            changeMonth: true
        };
    },

    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }

        var result = null;
        var value = this.fieldValue;
        var that = this;
        if (mode == 'edit') {
            result = $('<span><input class="datepicker" type="text"><input class="val" type="hidden"></span>');
            var el = result.find('input.datepicker').val(value);
            el.datepicker(this.datepickerOptions(result)).blur(function() {
                if (!$(this).val()) {
                    result.find('input.val').val('');
                }
            });

            // voodoo magic...
            // set the value of hidden field
            el.datepicker('setDate', el.datepicker('getDate'));
            // widget appears in bottom left corner for some reason, so we hide it
            el.datepicker('widget').hide();

            $(document).one('hashchange', function() {
                // if the <input> is still attached to DOM, then hide the datepicker
                // (that could possibly be still displayed by now)
                var element = el[0];
                while ( ( element = element.parentNode)) {
                    if (element === document) {
                        el.datepicker('hide').datepicker('destroy');
                        return;
                    }
                }
            });
        } else {
            result = $('<span class="val"></span>').text(value);
        }
        return result;
    }
});

$.wa.contactEditor.factoryTypes.IM = $.extend({}, $.wa.contactEditor.baseFieldType, {
    /** Accepts both a simple string and {value: previewHTML, data: stringToEdit} */
    setValue: function(data) {
        if (typeof data == 'undefined') {
            data = '';
        }
        if (typeof(data) == 'object') {
            this.fieldValue = data.data;
            this.viewValue = data.value;
        } else {
            this.fieldValue = this.viewValue = data;
        }
        if (this.currentMode == 'null' || !this.domElement) {
            return;
        }

        if (this.currentMode == 'edit') {
            this.domElement.find('input.val').val(this.fieldValue);
        } else {
            this.domElement.find('.val').html(this.viewValue);
        }
    },

    newInlineFieldElement: function(mode) {
        // Do not show anything in view mode if field is empty
        if(mode == 'view' && !this.fieldValue) {
            return null;
        }

        var result = null;
        if (mode == 'edit') {
            result = $('<span><input class="val" type="text"></span>');
            result.find('.val').val(this.fieldValue);
        } else {
            result = $('<span class="val"></span>').html(this.viewValue);
        }
        return result;
    }
});

$.wa.contactEditor.factoryTypes.Url = $.extend({}, $.wa.contactEditor.factoryTypes.IM, {
    validate: function(skipRequiredCheck) {
        var val = $.trim(this.getValue());

        if (!skipRequiredCheck && this.fieldData.required && !val) {
            return $_('This field is required.');
        }
        if (!val) {
            return null;
        }

        if (!(/^(https?|ftp|gopher|telnet|file|notes|ms-help)/.test(val))) {
            val = 'http://'+val;
            this.setValue(val);
        }

        var l = '[^`!()\\[\\]{};:\'".,<>?«»“”‘’\\s+]'; // letter allowed in url, including IDN
        var p = '[^`!\\[\\]{}\'"<>«»“”‘’\\s]'; // punctuation or letter allowed in url
        var regex = new RegExp('^(https?|ftp|gopher|telnet|file|notes|ms-help):((//)|(\\\\\\\\))+'+p+'*$', 'i');
        if (!regex.test(val)) {
            return $_('Incorrect URL format.');
        }

        // More restrictions for common protocols
        if (/^(http|ftp)/.test(val.toLowerCase())) {
            regex = new RegExp('^(https?|ftp):((//)|(\\\\\\\\))+((?:'+l+'+\\.)+'+l+'{2,6})((/|\\\\|#)'+p+'*)?$', 'i');
            if (!regex.test(val)) {
                return $_('Incorrect URL format.');
            }
        }

        return null;
    }
});

$.wa.contactEditor.factoryTypes.Email = $.extend({}, $.wa.contactEditor.factoryTypes.Url, {
    validate: function(skipRequiredCheck) {
        var val = $.trim(this.getValue());

        if (!skipRequiredCheck && this.fieldData.required && !val) {
            return $_('This field is required.');
        }
        if (!val) {
            return null;
        }
        var regex = new RegExp('^([^@\\s]+)@[^\\s@]+\\.[^\\s@\\.]{2,}$', 'i');
        if (!regex.test(val)) {
            return $_('Incorrect Email address format.');
        }
        return null;
    }
});

$.wa.contactEditor.factoryTypes.Checkbox = $.extend({}, $.wa.contactEditor.baseFieldType, {
    /** Load field contents from given data and update DOM. */
    setValue: function(data) {
        this.fieldValue = parseInt(data);
        if (this.currentMode == 'null' || !this.domElement) {
            return;
        }

        if (this.currentMode == 'edit') {
            this.domElement.find('input.val').attr('checked', !!this.fieldValue);
        } else {
            this.domElement.find('.val').text(this.fieldValue ? 'Yes' : 'No');
        }
    },

    newInlineFieldElement: function(mode) {
        var result = null;
        if (mode == 'edit') {
            result = $('<span><input class="val" type="checkbox" value="1" checked="checked"></span>');
            if (!this.fieldValue) {
                result.find('.val').removeAttr('checked');
            }
        } else {
            result = $('<span class="val"></span>').text(this.fieldValue ? 'Yes' : 'No');
        }
        return result;
    }
});

$.wa.contactEditor.factoryTypes.Number = $.extend({}, $.wa.contactEditor.baseFieldType, {
    validate: function(skipRequiredCheck) {
        var val = $.trim(this.getValue());
        if (!skipRequiredCheck && this.fieldData.required && !val && val !== 0) {
            return $_('This field is required.');
        }
        if (val && !(/^-?[0-9]+([\.,][0-9]+$)?/.test(val))) {
            return $_('Must be a number.');
        }
        return null;
    }
});

// EOF
;
