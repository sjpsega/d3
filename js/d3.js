/**
 * @author  jianping.shenjp
 * @version 2012-8-23
 */
jQuery(function($) {
    var util = $.D3Util;
    var d3 = {
        init: function() {
            $.ajaxSetup({
                dataType: "jsonp",
                scriptCharset: "utf-8"
            });
            this.readCookie();
            this.initSubmitBtnEvent();
        },
        readCookie: function() {
            var tagNames = $.cookie("tagNames");
            if (tagNames) {
                var tags = tagNames.split("|");
                if (tags.length == 2) {
                    var tag1 = tags[0];
                    var tag2 = tags[1];
                    if (tag1) {
                        $("#role1_tag").val(tag1);
                    }
                    if (tag2) {
                        $("#role2_tag").val(tag2);
                    }
                }
            }
        },
        initSubmitBtnEvent: function() {
            var self = this;
            var role1_data;
            var role2_data;
            var role1;
            var role2;
            var clickFun = function() {
                    var tag1 = $("#role1_tag");
                    var tag2 = $("#role2_tag");
                    var tagName1 = tag1.val().replace("#", "-");
                    var tagName2 = tag2.val().replace("#", "-");
                    if ($.trim(tagName1) == "" || $.trim(tagName2) == "") {
                        $("#tag-error").fadeIn(function() {
                            $(this).fadeOut(3000);
                        });
                        return;
                    }
                    var wait = function() {
                            var dtd = $.Deferred();
                            $.ajax({
                                url: util.getCarrerURL(tagName1),
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
                                    url: util.getCarrerURL(tagName2),
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
                        $.cookie("tagNames", tagName1 + "|" + tagName2, {
                            expires: 30
                        });
                        $(".role-selectes").fadeIn();
                        var modle = $.namespace('d3Model');
                        role1 = new modle.Role(role1_data);
                        role2 = new modle.Role(role2_data);
                        self.fillSelect(role1, "#role1_select", "#role1-ability");
                        self.fillSelect(role2, "#role2_select", "#role2-ability");
                    }).fail(function() {
                        console.log("error");
                    });
                }

                $("#submitBtn").on({click:clickFun});

                //键盘回车
                $(document).keypress(function(e) {
                    if (e.which == 13){
                        clickFun();
                    }
                })
        },
        fillSelect: function(role, role_select_id, ul_id) {
            var select = $(role_select_id).empty();
            var self = this;
            select.on({
                change: function() {
                    var selectedOption = select.find("option:selected");
                    readHeroInfoAndShow(role, selectedOption.attr("value"), ul_id, self);
                }
            })
            var tempDiv = $("<div>");
            var heroes = role.heroes;
            var index;
            var hero;
            for (index in heroes) {
                hero = heroes[index]
                tempDiv.append($("<option>").text(hero.name + "(" + hero.class + ")").attr("value", hero.id));
            }
            select.append(tempDiv.html());
            var selectedOption = select.find("option:selected");
            readHeroInfoAndShow(role, selectedOption.attr("value"), ul_id, self);

            function readHeroInfoAndShow(role, id, ul_id, context) {
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
                    $(".abilitys-info").fadeIn();
                    context.compare(".role-ability");
                }, ul_id);
            }
        },
        compare: function(clz) {
            var uls = $(clz);
            var lis1 = uls.eq(0).find("li");
            var lis2 = uls.eq(1).find("li");
            if (lis1.length > 0 && lis2.length > 0) {
                lis1.removeClass("success");
                lis2.removeClass("success");
                var loopLength = lis1.length;
                var tempLi1, tempLi2;
                for (var i = 0; i < loopLength; i++) {
                    tempLi1 = lis1.eq(i);
                    tempLi2 = lis2.eq(i);
                    if (parseInt(tempLi1.text()) * 100 > parseInt(tempLi2.text()) * 100) {
                        tempLi1.addClass("success");
                    } else if (parseInt(tempLi1.text()) * 100 < parseInt(tempLi2.text()) * 100) {
                        tempLi2.addClass("success");
                    }
                }
            }
        }
    }
    d3.init();
})
