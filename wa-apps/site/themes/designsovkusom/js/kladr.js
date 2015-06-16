function Kladr() {
    var $zip = $('#zip'),
    //$region = $('#region_text'),
        $city = $('#city'),
        $street = $('#street'),
        $building = $('#building');


    var $tooltip = $('.tooltip');


    $.kladr.setDefault({
        parentInput: '.address_form',
        verify: false,
        select: function (obj) {
            //setLabel($(this), obj.type);
            //$tooltip.hide();
            // console.log(typeof(obj.parents[0]));
            var region = obj.id.substr(0, 2);

            //reg = reg.substr(0, 2);
            //$("#address_form #region").val(reg);
            /*

             if (typeof(obj.parents[0]) !== "undefined") {
             var region_text = obj.parents[0].name;
             }
             */

            $("#address_form #region").val(region).change();

            //$("#address_form #region_text").val(region_text).change();
            $("#address_form #zip").val(obj.zip);

        },
        closeBefore: function (obj) {
            console.log('close before');
            var first_city = $('.autocomplete1').children('li').first().children('a').attr('data-val');
            var attr = $('#city').attr('data-kladr-id');
            if (typeof attr === 'undefined' || attr == false) {
                $city.kladr('controller').setValue(first_city);
            }

        },
        check: function (obj) {
            if (obj) {
                //  setLabel($(this), obj.type);
                // $tooltip.hide();
                // console.log(obj);
            }
            else {
                showError($(this), 'Введено неверно');
            }
        }
    });
    // $region.kladr('type', $.kladr.type.region);
    $city.kladr('type', $.kladr.type.city);
    $street.kladr('type', $.kladr.type.street);
    $building.kladr('type', $.kladr.type.building);

    // Отключаем проверку введённых данных для строений
    $city.kladr('withParents', true);
    $street.kladr('withParents', true);

    // Подключаем плагин для почтового индекса
    $zip.kladrZip(".address_form");


    function setLabel($input, text) {
        //console.log($input);
        text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        //$input.parent().find('.wa-name').text(text);
    }

    function addressUpdate() {
        var address = $.kladr.getAddress('.address_form');
        $('#address_text').text(address);
    }

    $(".address_form").change(function () {

        addressUpdate();
    });

    function showError($input, message) {
        $tooltip.find('span').text(message);

        var inputOffset = $input.offset(),
            inputWidth = $input.outerWidth(),
            inputHeight = $input.outerHeight();

        var tooltipHeight = $tooltip.outerHeight();

        $tooltip.css({
            left: (inputOffset.left + inputWidth + 10) + 'px',
            top: (inputOffset.top + (inputHeight - tooltipHeight) / 2 - 1) + 'px'
        });

        $tooltip.show();
    }


};