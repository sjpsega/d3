/**
 * @author  jianping.shenjp
 * @version 2012-8-23
 */
 (function($) {
    jQuery.namespace('d3Model');
    var modle = $.namespace('d3Model');
    var util = $.D3Util;
    var TRANS_MAP = {
        "damage": "DPS",
        "armor": "护甲",
        "strength": "力量",
        "dexterity": "敏捷",
        "vitality": "体能",
        "intelligence": "智力",
        "physicalResist": "物抗",
        "fireResist": "火抗",
        "coldResist": "冰抗",
        "lightningResist": "电抗",
        "poisonResist": "毒抗",
        "arcaneResist": "秘法抗",
        "damageIncrease": "伤害提升",
        "critChance": "暴击率",
        "critDamage": "暴击伤害",
        "damageReduction": "伤害减免",
        "attackSpeed": "攻击速度",
        "blockChance":"挡格几率",
        "thorns":"荆棘伤害",
        "lifeSteal":"生命窃取",
        "lifePerKill":"击杀回复",
        "lifeOnHit":"击中回复",
        "goldFind":"寻金率",
        "magicFind":"寻宝率"
    }
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
    modle.Role = Role;

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
            var args = Array.prototype.slice.call(arguments, 1);
            if (this._loaded) {
                if (handler) {
                    handler.apply(self, args);
                }
                return;
            }
            $.ajax({
                dataType: "jsonp",
                url: util.getHeroURL(this.battleTag, this.id),
                success: function(data) {
                    self._loaded = true;
                    self.info = returnFormatData(data);
                    self.info.stats.level = data.level;
                    handler.apply(self, args);
                }
            });
        }
    }
    modle.Hero = Hero;
    function returnFormatData(data) {
        var stats = data.stats;
        var percentPros = ["critChance", "critDamage", "damageReduction", "damageIncrease","goldFind","magicFind","blockChance","lifeSteal"];
        $.each(percentPros, function(index, item) {
            if (stats[item]) {
                stats[item] = percent(stats[item]);
            }
        });
        trans(stats);
        function percent(data) {
            return parseInt(Number(data) * 10000) / 100 + "%";
        }

        function trans(data) {
            $.each(data, function(index, item) {
                if (TRANS_MAP[index]) {
                    data[TRANS_MAP[index]] = data[index];
                    delete data[index];
                }
            });
        }
        return data;
    }
})(jQuery);
