/**
 * Created by vadimz on 20.03.15.
 */

var serviceUrl = "https://dadata.ru/api/v2",
    token = "237228439616128af79e8642b21cdc55bf6f9876 ",
    type = "ADDRESS";

function Dadata() {

    $('input[name="customer[email]"]').suggestions({
        serviceUrl: "https://dadata.ru/api/v2",
        autoSelectFirst: true,
        token: token,
        type: "EMAIL",
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function (suggestion) {
            console.log(suggestion);
        }
    });

    Name($('input[name="customer[lastname]"]'), $('input[name="customer[firstname]"]'));
    City();
}

function Name($surname, $name) {
    var self = {};
    self.$surname = $surname;
    self.$name = $name;
    var fioParts = ["SURNAME", "NAME", "PATRONYMIC"];
    // инициализируем подсказки на всех трех текстовых полях
    // (фамилия, имя, отчество)
    $.each([$surname, $name], function (index, $el) {
        var sgt = $el.suggestions({
            serviceUrl: "https://dadata.ru/api/v2",
            token: "237228439616128af79e8642b21cdc55bf6f9876",
            type: "NAME",
            triggerSelectOnSpace: false,
            hint: "",
            noCache: true,
            params: {
                // каждому полю --- соответствующая подсказка
                parts: [fioParts[index]]
            }
        });
    });
}
function City() {
    console.log(556);
// регион и район
    $("#region_text").suggestions({
        serviceUrl: serviceUrl,
        token: token,
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "region-area",
        onSelect: function (suggestion) {
            var region_id = suggestion.data.kladr_id.substr(0, 2);
            $('#region').val(region_id).change();
            showPostalCode(suggestion);
        },
        onSelectNothing: clearPostalCode

    });

// город и населенный пункт
    $("#city").suggestions({
        serviceUrl: serviceUrl,
        token: "237228439616128af79e8642b21cdc55bf6f9876",
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "city-settlement",
        onSelect: showPostalCode,
        onSelectNothing: clearPostalCode,
        constraints: region
    });

// geolocateCity($city);

// улица
    $("#street").suggestions({
        serviceUrl: serviceUrl,
        token: token,
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "street",
        onSelect: showPostalCode,
        onSelectNothing: clearPostalCode,
        constraints: city
    });

// дом
    $("#house").suggestions({
        serviceUrl: serviceUrl,
        token: token,
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "house",
        onSelect: showPostalCode,
        onSelectNothing: clearPostalCode,
        constraints: street
    });
}
function showPostalCode(suggestion) {
    $("#zip").val(suggestion.data.postal_code);
}
function clearPostalCode(suggestion) {
    $("#zip").val("");
}


// для профиля

function Dadataprofile() {

    $('input[name="profile[email]"]').suggestions({
        serviceUrl: "https://dadata.ru/api/v2",
        autoSelectFirst: true,
        token: token,
        type: "EMAIL",
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function (suggestion) {
            console.log(suggestion);
        }
    });

    Nameprofile($('input[name="profile[lastname]"]'), $('input[name="profile[firstname]"]'));
    Cityprofile();
}

function Nameprofile($surname, $name) {
    var self = {};
    self.$surname = $surname;
    self.$name = $name;
    var fioParts = ["SURNAME", "NAME", "PATRONYMIC"];
    // инициализируем подсказки на всех трех текстовых полях
    // (фамилия, имя, отчество)
    $.each([$surname, $name], function (index, $el) {
        var sgt = $el.suggestions({
            serviceUrl: "https://dadata.ru/api/v2",
            token: "237228439616128af79e8642b21cdc55bf6f9876",
            type: "NAME",
            triggerSelectOnSpace: false,
            hint: "",
            noCache: true,
            params: {
                // каждому полю --- соответствующая подсказка
                parts: [fioParts[index]]
            }
        });
    });
}
function Cityprofile() {
// регион и район
    $('input[name="profile[region]"]').suggestions({
        serviceUrl: serviceUrl,
        token: token,
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "region-area",
        onSelect: function (suggestion) {
            var region_id = suggestion.data.kladr_id.substr(0, 2);
            $('#region').val(region_id).change();
            showPostalCodeprofile(suggestion);
        },
        onSelectNothing: clearPostalCodeprofile

    });

// город и населенный пункт
    $('input[name="profile[address][city]"]').suggestions({
        serviceUrl: serviceUrl,
        token: "237228439616128af79e8642b21cdc55bf6f9876",
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "city-settlement",
        onSelect: showPostalCodeprofile,
        onSelectNothing: clearPostalCodeprofile
    });

// geolocateCity($city);

// улица
    $('input[name="profile[address][street_name]"]').suggestions({
        serviceUrl: serviceUrl,
        token: token,
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "street",
        onSelect: showPostalCodeprofile,
        onSelectNothing: clearPostalCodeprofile
    });

// дом
    $('input[name="profile[address][house]"]').suggestions({
        serviceUrl: serviceUrl,
        token: token,
        autoSelectFirst: true,
        type: type,
        hint: false,
        bounds: "house",
        onSelect: showPostalCodeprofile,
        onSelectNothing: clearPostalCodeprofile
    });
}
function showPostalCodeprofile(suggestion) {
    $("#zip").val(suggestion.data.postal_code);
}
function clearPostalCodeprofile(suggestion) {
    $("#zip").val("");
}