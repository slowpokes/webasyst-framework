if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.cut = function() {
    return {
        init: function() {
            this.opts.cut_plugin = {
                wa_post_cut_text_default: $.wa_blog.editor.options.cut_link_label_default || $_('Continue reading →'),
                element_class: 'elrte-wa_post_cut'
            };
            var button = this.button.add('wa-post-cut', $_('Post cut'));
            this.button.addCallback(button, cutButton);
            this.button.setIcon(button, '<i class="re-wa-post-cut"></i>');
        }
    };

    function cutButton(buttonName, buttonDOM, buttonObj, e) {
        if (this.code.get().indexOf(this.opts.cut_plugin.element_class) >= 0) {
            return;
        }
        var html = '<span class="b-elrte-wa-split-vertical '+ this.opts.cut_plugin.element_class +'">'+ this.opts.cut_plugin.wa_post_cut_text_default +'</span>';
        this.insert.html(html);
    }
}

RedactorPlugins.product = function() {
    return {
        init: function() {
            this.button.addCallback(this.button.add('wa_post_product', 'Вставить товар'), this.product.show);
        },
        show: function () {
            var url = prompt("Укажите ссылку на товар на сайте");
            if (url!=null) {
                this.product.insert(url);
            }
        },
        insert: function (url) {
            var html = '<div class="embed-product" data-url="'+url+'"><a href="'+url+'">'+url+'</div>';
            this.selection.restore();
            var b = this.selection.getBlock() || this.selection.getCurrent();
            b ? $(b).after(html) : this.insert.html(html);
            this.code.sync()
        }
    };
}
