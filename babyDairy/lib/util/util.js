/* 
* @Author: Marte
* @Date:   2017-05-19 10:16:24
* @Last Modified by:   Marte
* @Last Modified time: 2017-05-27 10:35:19
*/
// var Util = (function(){
var Util = {};
    Util.uploadFile = function(e){
    // function uploadFile(e){
        var filePromise = new Promise(function(resolve,reject){
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                $.ajax({
                    type: "POST",
                    url: '/upload',
                    data: { img: event.target.result.split("base64,")[1] },
                    dataType: 'json',
                    success: function (data) {
                        resolve(data);
                    }
                });
            };
            reader.readAsDataURL(file);
        });
        return filePromise;
    }
//     return {
//         uploadFile : uploadFile
//     }
// })();
export {Util};