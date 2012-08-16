var D3Util = {
    HOST: "http://us.battle.net",
    CAREER_API: "/api/d3/profile/",
    HERO_API: "/api/d3/profile/",
    CONN_SYMBOL: "/",
    getCarrerURL: function(tag) {
        return D3Util.HOST + D3Util.CAREER_API + tag + D3Util.CONN_SYMBOL;
    },
    getHeroURL: function(tag, heroid) {
        return D3Util.HOST + D3Util.HERO_API + tag + D3Util.CONN_SYMBOL + "hero" + D3Util.CONN_SYMBOL + heroid;
    }
}
