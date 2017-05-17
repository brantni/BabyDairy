/* 
* @Author: Marte
* @Date:   2017-05-12 14:35:14
* @Last Modified by:   Marte
* @Last Modified time: 2017-05-16 14:37:25
*/
(function PubSubEvent(){
    //events={key:[fun1,fun2]}
    var events = {};

    PubSubEvent.publish = function (key,data){
        if(events[key]){
            var funArray = events[key];
            funArray.forEach(function(fun){
                fun.apply(null,data);
            });
        }
    }

    PubSubEvent.subscribe = function (key,fun){
        var uid = "";
        if(typeof key != "string"||typeof fun != "function"){
            return false;
        }
        if(!events[key]){
            events[key] = [];
        }

        events[key].push(fun);
        
        var token = {};
        token.key = key;
        token.fun = fun;

        return token;
    }
    /*
     可能有以下几种情况：
     1.传入key+fun：PubSubEvent.unsubscribe("key",fun)--取消特定函数
     2.传入key：PubSubEvent.unsubscribe("key")--取消key下的所有函数
     3.传入token：PubSubEvent.unsubscribe(token)--取消token对应的特定函数
     3.传入函数（可以是匿名）：PubSubEvent.unsubscribe(function)--取消特定函数
     */
    PubSubEvent.unsubscribe = function (){
        var argArray = Array.prototype.slice.call(arguments);
        if(argArray.length == 0){
            return false;
        }
        if(argArray.length == 1){
            var arg = argArray[0];
            if(typeof arg == "function"){
                var e,functionArray;
                for(e in events){
                    functionArray = events[e];
                    functionArray.forEach(function(fun,i){
                        if(arg == fun){
                            functionArray.splice(i,1);
                            return;
                        }
                    });
                }
                return true;
            }
            if(typeof arg == "string"){
                if(!events[arg]){
                    return false;
                }
                delete events[arg];
                return true;
            }
            if(Object.prototype.toString.call(arg) == "[object Object]"){
                var token = arg;
                return deleteFun(token.key,token.fun);
            }
        }
        if(argArray.length == 2){
            // var [key,fun] = [argArray[0],argArray[1]];
            var key = argArray[0],
                fun = argArray[1];
            if(typeof key != "string"){
                return false;
            }
            if(typeof fun != "function"){
                return false;
            }
            return deleteFun(key,fun);
        }
        return false;
    }

    function deleteFun(key,fun){
        var funArray = events[key],
            hitEventIndex;

        funArray.forEach(function(o,i){
            if(o == fun){
                hitEventIndex = i;
                return;
            }
        });
        if(hitEventIndex == undefined){
            return false;
        }

        funArray.splice(hitEventIndex,1);
        return true;
    }

    window.PubSubEvent = PubSubEvent;
})();