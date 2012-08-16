var $ = jQuery;
var util = D3Util;
var Role = function(data) {
        var self = this;
        this.battleTag = data.battleTag.replace("#", "-");
        this.heroes = [];
        var heroesData = data.heroes;
        var hero;
        for (var str in heroesData) {
            hero = new Hero(heroesData[str]);
            hero.battleTag = this.battleTag;
            this.heroes.push(hero);
            hero = null;
        }
        // $.each(data.heroes,function(index,item){
        //     console.log(item);
        // });
        // this.heroes = data.heroes;
    }
Role.prototype = {
    getHeroById: function(id) {
        var hero;
        for (var str in this.heroes) {
            hero = this.heroes[str];
            if (hero.id + "" === id + "") {
                return hero
                break;
            }
        }
        return null;
    }
}

var Hero = function(data) {
        this.class = data.class;
        this.level = data.level;
        this.name = data.name;
        this.id = data.id;
        this.hardcore = data.hardcore;
        this._loaded = false;
        this.info;
        this.stats;
    }
Hero.prototype = {
    loadInfo: function(handler) {
        var self = this;
        var args = Array.prototype.slice.call(arguments,1);
        if (this._loaded) {
            if(handler){
                handler.apply(self,args);
            }
            return;
        }
            $.ajax({
                dataType:"jsonp",
                url: D3Util.getHeroURL(this.battleTag, this.id),
                success: function(data) {
                    self._loaded = true;
                    self.info = data;
                    handler.apply(self,args);
                }
            });
    }
}
