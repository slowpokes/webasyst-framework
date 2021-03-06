/*!
 * AnchorJS - v0.3.0 - 2015-02-10
 * https://github.com/bryanbraun/anchorjs
 * Copyright (c) 2015 Bryan Braun; Licensed MIT
 */
function addAnchors(e) {
    "use strict";
    if (e) {
        if ("string" != typeof e)throw new Error("AnchorJS accepts only strings; you used a " + typeof e)
    } else e = "h1, h2, h3, h4, h5, h6";
    for (var t = document.querySelectorAll(e), r = 0; r < t.length; r++) {
        var n;
        if (t[r].hasAttribute("id"))n = t[r].getAttribute("id"); else {
            var s = document.body.textContent ? "textContent" : "innerText", a = t[r][s], o = a.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "-").toLowerCase().substring(0, 32);
            t[r].setAttribute("id", o), n = o
        }
        var i = n.replace(/-/g, " "), c = '<a class="anchorjs-link" href="#' + n + '"><span class="anchorjs-description">Anchor link for: ' + i + '</span><span class="anchorjs-icon" aria-hidden="true"></span></a>';
        t[r].innerHTML += c
    }
}