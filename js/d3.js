jQuery(function($) {
    var util = D3Util;
    var role1_data;
    var role2_data;
    var role1;
    var role2;
    $("#submitBtn").on({
        click: function() {
            var tag1 = $("#role1_tag");
            var tag2 = $("#role2_tag");
            if ($.trim(tag1.val()) == "" || $.trim(tag2.val()) == "") {
                $("#tag-error").fadeIn(function() {
                    $(this).fadeOut(3000);
                });
                return;
            }
            var wait = function() {
                    var dtd = $.Deferred();
                    $.ajax({
                        dataType: "jsonp",
                        url: util.getCarrerURL(tag1.val()),
                        success: function(data) {
                            if (!data.battleTag) {
                                dtd.reject();
                                return;
                            }
                            role1_data = data;
                        }
                    }).done(function() {
                        if (dtd.isRejected()) {
                            return;
                        }
                        $.ajax({
                            dataType: "jsonp",
                            url: util.getCarrerURL(tag2.val()),
                            success: function(data) {
                                if (!data.battleTag) {
                                    dtd.reject();
                                    return;
                                }
                                role2_data = data;
                                dtd.resolve();
                            }
                        })
                    });
                    return dtd.promise();
                }
            $.when(wait()).done(function() {
                console.log("done");
                role1 = new Role(role1_data);
                role2 = new Role(role2_data);
                fillSelect(role1, "#role1_select", "#role1-ability");
                fillSelect(role2, "#role2_select", "#role2-ability");
            }).fail(function() {
                console.log("error");
            });
        }
    });

    function fillSelect(role, role_select_id, ul_id) {
        var select = $(role_select_id).empty();
        select.on({
            change: function() {
                var selectedOption = select.find("option:selected");
                readHeroInfoAndShow(role, selectedOption.attr("value"), ul_id);
            }
        })
        var tempDiv = $("<div>");
        var heroes = role.heroes;
        var index;
        var hero;
        for (index in heroes) {
            hero = heroes[index]
            tempDiv.append($("<option>").text(hero.name+"("+hero.class+")").attr("value", hero.id));
        }
        select.append(tempDiv.html());
        var selectedOption = select.find("option:selected");
        readHeroInfoAndShow(role, selectedOption.attr("value"), ul_id);

        function readHeroInfoAndShow(role, id, ul_id) {
            var hero = role.getHeroById(id);
            hero.loadInfo(function(ul_id) {
                var ul = $(".abilitys");
                var tempDiv = $("<div>");
                var stats = this.info.stats;
                if (ul.html() == "") {
                    for (var str in stats) {
                        tempDiv.append($("<li>").text(str));
                    }
                    ul.append(tempDiv.html());
                }
                ul = $(ul_id);
                ul.empty();
                tempDiv.empty();
                for (var str in stats) {
                    tempDiv.append($("<li>").text(stats[str]));
                }
                ul.append(tempDiv.html());
            },ul_id);
        }
    }
})
