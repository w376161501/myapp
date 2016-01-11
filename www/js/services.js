angular.module('starter.services', [])

.factory('HelpTalk', function($http) {
  var comments = [];
  return {
    all: function() {
      return $http.get("http://10.192.164.102/learn/newcomment.php").then(function(response){
            comments =response.data;
            for (var i = 0; i < comments.length; i++) {
            console.log(comments[i].guid);
            }
            console.log(comments.length);
            return comments;
        })
   }, 
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('InformList', function($http){
  var BASE_URL = "http://10.192.164.102/learn/connection.php";
  var items = [];
  var i=1;

  return {
    GetFeed: function(){
      return $http.get( BASE_URL+'?records=6').then(function(response){
       items = response.data.records.splice(0,4);
       console.log(items);
        return items;
      });
    },
     get: function(chatId) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id == parseInt(chatId)) {
          return items[i];
        }
      }
      return null;
    },
    GetNewUser: function(){
      return $http.get(BASE_URL).then(function(response){
        items = response.data.records.splice(0,4);
        return items;
      });
    },
    GetMoreUser: function(){
      i++;
      console.log(i);
      return $http.get(BASE_URL).then(function(response){
        items = response.data.records.splice(0,i*4);
        if(i>=3)
        {
          items=[];
        }
        return items;
      });
    }
  }
})
//新添加类，用于读取评论
.factory('CommentList', function($http){
  var comments = [];
  var CommentList = [];
  var i=1;
  var n=0;
  return {
     get: function(chatId) {
      return  $http.get("http://10.192.164.102/learn/manager_comment.php",{params:{name:"",commentText:"",Kind:"query"}}).then(function(response){
         comments = response.data.Comment;
         var n=0;
         console.log(comments.length);
         for (var i = 0; i < comments.length; i++) {
            console.log(comments[i].NC_id+"=="+chatId);
         if (comments[i].NC_id == parseInt(chatId)) {
           console.log("进入把===改为==");
            comments[n++]=comments[i];
            break;
        }
      }
     return comments.splice(0, n);
   });  
   },
   getcomment: function(chatId) {
      return  $http.get("http://10.192.164.102/learn/manager_comment.php",{params:{name:"",commentText:"",Kind:"query"}}).then(function(response){
         comments = response.data.Comment;
         var n=0;
         console.log(comments.length);
         for (var i = 0; i < comments.length; i++) {
            console.log(comments[i].NC_id+"=="+chatId);
         if (comments[i].NC_id == parseInt(chatId)) {
           console.log("进入把===改为==");
            comments[n++]=comments[i];
            break;
          
        }
      }
     return comments.splice(0, n);
   });  
   }
 }
})
//post传输必须
.factory('HttpInterceptor', function() {
  function serializeData(data) {
    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {
      return ((data == null) ? "" : data.toString());
    }
    var buffer = [];
    // Serialize each key in the object.
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      var value = data[name];
      buffer.push(
        encodeURIComponent(name) +
        "=" +
        encodeURIComponent((value == null) ? "" : value)
      );
    }
    // Serialize the buffer and clean it up for transportation.
    var source = buffer
      .join("&")
      .replace(/%20/g, "+");
    return (source);
  }
  return {
    request: function(config) {
      if (config.method === 'POST') {
        if (config.data) {
          config.headers = config.headers || {};
          config.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
          config.data = serializeData(config.data);
        }
      }
      return config;
    }
  };
})
.factory('UpdateServe', function($cordovaFileTransfer,$http,$ionicLoading,$timeout,$cordovaProgress){
  return {
     FileTransferupLoad: function(imgurl,success,error,id) {
        var options = new FileUploadOptions();
         options.fileKey = "upfile";//用于设置参数，对应form表单里控件的name属性,
         options.fileName = imgurl.substr(imgurl.lastIndexOf('/') + 1);
         options.mimeType ="image/jpeg";
         // options.mimeType = "multipart/form-data";//这个参数修改了，后台就跟普通表单页面post上传一样 enctype="multipart/form-data"
         var params = {};
         params['id'] = id;
         options.params = params;
         options.chunkedMode=false;
         $ionicLoading.show({
                                template: "已经上传:"
                       });
        $cordovaFileTransfer.upload(encodeURI("http://10.192.164.102/learn/PHPupdate.php"),imgurl,options,false)
        .then(function(result) {
          if(JSON.stringify(result.response).indexOf("OK"))
          {
               var i=JSON.stringify(result.response).indexOf("*");
               var j=JSON.stringify(result.response).lastIndexOf("*");
               var back=JSON.stringify(result.response).substring(i+1,j);
               $scope.image=back;
              $ionicLoading.hide();
          }
         }, function(error){
         alert("上传失败"+JSON.stringify(error));
          $ionicLoading.hide();
         }, function (progress) {
            $timeout(function () {
                           var uploadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "已经上传：" + Math.floor(uploadProgress) + "%"
                            });
                            if (uploadProgress > 99) {
                                $ionicLoading.hide();
                             }
            },2000)
       });
      }
   }
})
.factory('UpdateApk',function ($ionicPlatform, $rootScope,$ionicActionSheet, $timeout,  $cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2,$http) {
function checkUpdate() {
 var serverAppVersion = "3.0.0"; //从服务端获取最新版本
  $http.post("http://10.192.164.102/learn/version.php").success(function(data){ 
 $cordovaAppVersion.getVersionNumber().then(function (version) {
 if (version != serverAppVersion) 
 {
   var confirmPopup = $ionicPopup.confirm({
        title: '版本升级',
        template:data.msg, //从服务端获取更新的内容
        cancelText: '取消',
        okText: '升级'
     });
  confirmPopup.then(function (res) {
        if (res) {
            $ionicLoading.show({
                template: "已经下载: 0%"
            });
            var url = data.apk; //可以从服务端获取更新APP的路径
            var targetPath = "file:///storage/sdcard0/Download/xianshibang.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
            var trustHosts = true
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                // 打开下载下来的APP
                $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                ).then(function () {
                        // 成功
                    }, function (err) {
                        // 错误
                    });
                $ionicLoading.hide();
            }, function (err) {
                alert('下载失败');
                 $ionicLoading.hide();
            }, function (progress) {
                //进度，这里使用文字显示下载百分比
                $timeout(function () {
                    var downloadProgress = (progress.loaded / progress.total) * 100;
                    $ionicLoading.show({
                        template: "已经下载：" + Math.floor(downloadProgress) + "%"
                    });
                    if (downloadProgress > 99) {
                        $ionicLoading.hide();
                        ionic.Platform.exitApp();  
                    }
                })
            });
          }
         else 
         {
            
         }
      }) 
    } })
  });
}
return{
        UpdateVersionApk: function()
       {
        checkUpdate();
        }
     };
 })
.factory('DownloadMedia',function ($ionicPlatform, $rootScope,$ionicActionSheet, $timeout,  $cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2,$http) {
  function checkUpdate(url) {
            var url = data.url; //可以从服务端获取更新APP的路径
            var trustHosts = true
            var options = {};
            $cordovaFileTransfer.download(url, cordova.file.dataDirectory, options, trustHosts).then(function (result) { 
              alert("存放完毕");
            }, function (err) {   
            }, function (progress) {
            });
  };
  function checkUpdate(url) {
            $http.post("http://10.192.164.102/learn/cacheMedia.php").success(function(data){ 
             checkUpdate(data.url)
            },function (err) {

            });
  };
})

.factory('Updateheadimage', function($cordovaFileTransfer,$http,$ionicLoading,$timeout,$cordovaProgress){
  return {
     FileTransferupLoad: function(imgurl,username) {
        var options = new FileUploadOptions();
         options.fileKey = "upfile";//用于设置参数，对应form表单里控件的name属性,
         options.fileName = imgurl.substr(imgurl.lastIndexOf('/') + 1);
         options.mimeType ="image/jpeg";
         var params = {};
         params['name'] = username;
         options.params = params;
         options.chunkedMode=false;
         $ionicLoading.show({
                                template: "正在拼命上传头像"
                       });
        $cordovaFileTransfer.upload(encodeURI("http://10.192.164.102/learn/PHPupdateheadimage.php"),imgurl,options,false)
         .then(function(result) {
           $ionicLoading.hide();
           
         }, function(error){
         alert("上传失败");
          $ionicLoading.hide();
         });
      }
   }
})
// .factory('obtainheadimage', function($http,$ionicPopup,OpenCamera,openimagePicker,Updateheadimage,$timeout,$q){
//  return {
//    showConfirm: function(name) { 
//     var deferrimage = $q.defer(); 
//     var myPopup = $ionicPopup.show({
//      title: '更换头像',//主标题
//      subTitle: '换头像',//子标题
//      buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
//      text: '拍照',
//      type: 'button-positive',
//     onTap: function(e) {
//       // 当点击时，e.preventDefault() 会阻止弹窗关闭。
//       e.preventDefault();
//       var promise = OpenCamera.taskPicture(); // 同步调用，获得承诺接口  
//       promise.then(function(data) {  // 调用承诺API获取数据 .resolve  
//       Updateheadimage.FileTransferupLoad(data,name);
//       deferrimage.resolve(data);
//        }, function(err) {  
//       deferrimage.reject(err); 
//        });  
//     }
//     }, {
//     text: '相册',
//     type: 'button-positive',
//     onTap: function(e) {
//       // 返回的值会导致处理给定的值。
//       var promise = openimagePicker.readalbum(); // 同步调用，获得承诺接口  
//       promise.then(function(data) {  // 调用承诺API获取数据 .resolve  
//       Updateheadimage.FileTransferupLoad(data,name);
//       deferrimage.resolve(data);
//        }, function(err) {  
//       deferrimage.reject(err); 
//        });  
//     }
//     },{
//     text: '取消',
//     type: 'button-positive',
//     onTap: function(e) {
//       myPopup.close();
//     }
//     }]
//     });
//     $timeout(function() {
//       myPopup.close(); //由于某种原因3秒后关闭弹出
//    }, 3000);
//   return deferrimage.promise;
//   }
// }
// })
.factory('obtainheadimage', function($http,$ionicActionSheet,OpenCamera,openimagePicker,Updateheadimage,$timeout,$q){
 return {
    showConfirm: function(name) { 
       var deferrimage = $q.defer(); 
       var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: '<b>拍照</b> 上传'
      }, {
        text: ' <b>相册</b> 上传'
      }],
      cancelText: '取 消',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        // 相册文件选择上传
        if (index == 1) {
             var promise = openimagePicker.readalbum(); // 同步调用，获得承诺接口  
      promise.then(function(data) {  // 调用承诺API获取数据 .resolve  
      Updateheadimage.FileTransferupLoad(data,name);
      deferrimage.resolve(data);
       }, function(err) {  
      deferrimage.reject(err); 
       });  
        } else if (index == 0) {
             var promise = openimagePicker.readalbum(); // 同步调用，获得承诺接口  
      promise.then(function(data) {  // 调用承诺API获取数据 .resolve  
      Updateheadimage.FileTransferupLoad(data,name);
      deferrimage.resolve(data);
       }, function(err) {  
      deferrimage.reject(err); 
       });  

      $timeout(function() {
          hideSheet.close(); //由于某种原因3秒后关闭弹出
        }, 3000);
        } 
       return deferrimage.promise;
      }
    });
  }
  }
})


.factory('Lookimage', function($ionicModal,$ionicSlideBoxDelegate){
 return {
    showimage: function(prop) { 
  $ionicModal.fromTemplateUrl('templates/lookbigimage.html', {
      animation: 'slide-in-up'
    }).then(function(moda) {
       modal = moda;
    });
  openModal = function(){
    modal.show();
  }
  closeModal = function(){
    modal.hide();
  }
  return openModal();
 }
}
})
.factory('OpenCamera', function($cordovaCamera,$state,$q){
 return {
    taskPicture: function(prop) {  
    if (!navigator.camera) 
      {
            return; 
      }
       var deferred = $q.defer(); 
       var options = 
       {
        quality: 50,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
        allowEdit: false,                                        //在选择之前允许修改截图
        encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 200,                                        //照片宽度
        targetHeight: 200,                                       //照片高度
        // mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        // cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        saveToPhotoAlbum: false               
      };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
     deferred.resolve(imageURI);
    }, function(err) {
       alert("照相机打开异常：" + err);
       deferred.reject(err); 
    });
   return deferred.promise;
  }
  };
})
.factory('openimagePicker', function($http,$cordovaImagePicker,$q){
 return {
    readalbum: function(prop) {  
    if (!window.imagePicker) 
      {
            return; 
      }
      var deferred = $q.defer(); 
      var options = {
      minimumImagesCount: 1,
      maximumImagesCount: 2,
      width: 100,
      height: 100,
      quality: 80
    };
    $cordovaImagePicker.getPictures(options).then(function(results) {
      if(results.length>0) 
      {
        deferred.resolve(results[0]);
      }  
    }, function(error) {
      deferred.resolve(error);
    });
     return deferred.promise;
  }
}
})
.factory('inputvalidate', function($http){
 return {
    is_mobile: function(value) {  
      var pattern=/^1[358][0123456789]\d{8}$/; 
      console.log(pattern);
       console.log(value);
    if(!pattern.test(value)){ 
      console.log("pattern");
        return false; 
      } 
    return true; 
     },
   is_email: function(value) {  
     var pattern=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; 
    if(!pattern.test(value)){ 
        return false;  
    } 
    return true; 
  },
  is_user: function(value) {  
   var re = /^[a-zA-z]\w{3,15}$/;
    if(re.test(value)){
       return false;
    }else{
       return true;
    } 
  }         
}
})
 
//  .factory('Loginin', function($http,$rootScope,inputvalidate){ 
//   return {
//     Login: function(loginname,loginpassword,logintype,executetype){
//       if
//      $http.get("http://10.192.164.102/learn/manager_users.php",{params:{name:$rootScope.loginData.username,userpssword:$rootScope.loginData.password,kind:"query"}}).success(function(data){ 
//       var user=data;
//     if(user.kind=="OK")
//     { 
//       var user={}
//       $rootScope.loginData.loginimage=user.headimage;
//       $scope.menuLogin.menuimage=user.headimage;
//       $scope.menuLogin.menulogintext="欢迎"+$rootScope.loginData.username+"回来";
//       $rootScope.loginoutcrtl=$rootScope.loginData.username;
//       $scope.modal.hide();//隐藏菜单
//       $scope.loginagain=false;
//     }
//     else
//     {
//       $rootScope.loginData.error="用户名或密码错误";

//     }
//    });
//     }
//   }
// })