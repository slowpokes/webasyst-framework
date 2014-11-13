function Kladr() {
    var $zip = $('#zip'),
        $city = $('#citys'),
        $street = $('#street'),
        $building = $('#building');

    var $tooltip = $('.tooltip');


    $.kladr.setDefault({
        parentInput: '.address',
        verify: true,
        select: function (obj) {
            setLabel($(this), obj.type);
            $tooltip.hide();
            var region = (obj.id.substr(0,2));
            $("#address_form #regions").val(region);
            $("#address_form #zips").val(obj.zip);
        },
        check: function (obj) {
            if (obj) {
                setLabel($(this), obj.type);
                $tooltip.hide();
                console.log(obj);
            }
            else {
                showError($(this), 'Введено неверно');
            }
        }
    });

    $city.kladr('type', $.kladr.type.city);
    $street.kladr('type', $.kladr.type.street);
    $building.kladr('type', $.kladr.type.building);

    // Отключаем проверку введённых данных для строений
    $building.kladr('verify', false);

    $city.kladr('withParents', true);

    // Подключаем плагин для почтового индекса
    $zip.kladrZip();



    function setLabel ($input, text) {
        text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        $input.parent().find('label').text(text);
    }

    function showError ($input, message) {
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