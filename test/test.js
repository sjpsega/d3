jQuery(function($){
    //http://blizzard.github.com/d3-api-docs/#career-profile/career-profile-example
    var util = D3Util;
    var A_TAG = "IORI-1902";
    var B_TAG = "raywu-1265";
    var ERROR_TAG = "IORI-00011";
    module("Ajax调用测试");
    asyncTest("调用单个数据正常",function(){
        var url = util.getCarrerURL(A_TAG);
        $.ajax({
          url: url,
          type: "GET",
          dataType:"jsonp",
          success: function(data){
            ok(data.battleTag != null,"数据正常返回");
            start();
          }
        });
    });
    asyncTest("调用错误数据数据识别",function(){
        var url = util.getCarrerURL(ERROR_TAG);
        $.ajax({
          url: url,
          type: "GET",
          dataType:"jsonp",
          success: function(data){
            console.log(data);
            ok(!(data.battleTag != null),"数据错误");
            start();
          },
          error:function(){
            alert("error");
          }
        });
    });
    asyncTest("调用两个数据均正常返回",function(){
        var url = util.getCarrerURL(A_TAG);
        var url2 = util.getCarrerURL(B_TAG);
        var wait = function(){
          var dtd = $.Deferred(); 
            $.ajax({
            url: url,
            type: "GET",
            dataType:"jsonp",
            success: function(data){
              ok(data.battleTag != null,"数据正常返回");
              if(!data.battleTag){
                dtd.reject();
                return;
              }
            }
          }).done(function(){
            if(dtd.isRejected()){
              return;
            }
            $.ajax({
              url: url2,
              type: "GET",
              dataType:"jsonp",
              success: function(data){
                ok(data.battleTag != null,"数据正常返回");
                if(!data.battleTag){
                  dtd.reject();
                  return;
                }
                dtd.resolve();
              }
            })
          });
          return dtd.promise();
        }
        $.when(wait()).done(function(){
          ok(true,"结果判断正确");
          start();
        }).fail(function(){
            ok(false,"结果判断错误");
            start();
        });
    });
    asyncTest("调用两个数据一个正常，一个失败，最终准确识别",function(){
        var url = util.getCarrerURL(A_TAG);
        var url2 = util.getCarrerURL(ERROR_TAG);
        var wait = function(){
          var dtd = $.Deferred(); 
            $.ajax({
            url: url,
            type: "GET",
            dataType:"jsonp",
            success: function(data){
              ok(data.battleTag != null,"数据正常返回");
              if(!data.battleTag){
                dtd.reject();
                return;
              }
            }
          }).done(function(){
            if(dtd.isRejected()){
              return;
            }
            $.ajax({
              url: url2,
              type: "GET",
              dataType:"jsonp",
              success: function(data){
                ok(!(data.battleTag != null),"数据错误");
                if(!data.battleTag){
                  dtd.reject();
                  return;
                }
                dtd.resolve();
              }
            })
          });
          return dtd.promise();
        }
        $.when(wait()).done(function(){
          ok(false,"结果判断错误");
          start();
        }).fail(function(){
            ok(true,"结果判断正确");
            start();
        });
    });

    asyncTest("与前一个case调用顺序调换，测试",function(){
        var url = util.getCarrerURL(A_TAG);
        var url2 = util.getCarrerURL(ERROR_TAG);
        var wait = function(){
          var dtd = $.Deferred(); 
            $.ajax({
            url: url2,
            type: "GET",
            dataType:"jsonp",
            success: function(data){
              ok(!(data.battleTag != null),"数据错误");
              if(!data.battleTag){
                dtd.reject();
                return;
              }
            }
          }).done(function(){
            if(dtd.isRejected()){
              return;
            }
            $.ajax({
              url: url,
              type: "GET",
              dataType:"jsonp",
              success: function(data){
                ok(data.battleTag != null,"数据正常返回");
                if(!data.battleTag){
                  dtd.reject();
                  return;
                }
                dtd.resolve();
              }
            })
          })
          return dtd.promise();
        }
        $.when(wait()).done(function(){
            ok(false,"结果判断错误");
            start();
        }).fail(function(){
            ok(true,"结果判断正确");
            start();
        });
    });
})