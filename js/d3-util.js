/**
 * @author  jianping.shenjp
 * @version 2012-8-23
 */
 (function($) {
    $.namespace = function() {
        var a = arguments,
            o = null,
            i, j, d;
        for (i = 0; i < a.length; i = i + 1) {
            d = a[i].split(".");
            o = window;
            for (j = 0; j < d.length; j = j + 1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    };
    $.namespace("d3Util");
    $.D3Util = {
        HOST: "http://us.battle.net",
        CAREER_API: "/api/d3/profile/",
        HERO_API: "/api/d3/profile/",
        CONN_SYMBOL: "/",
        getCarrerURL: function(tag) {
            return this.HOST + this.CAREER_API + tag + this.CONN_SYMBOL;
        },
        getHeroURL: function(tag, heroid) {
            return this.HOST + this.HERO_API + tag + this.CONN_SYMBOL + "hero" + this.CONN_SYMBOL + heroid;
        }
    }
})(jQuery);
