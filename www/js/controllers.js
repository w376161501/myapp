angular.module('starter.controllers', [])
// 向导页面
.controller('TutorialCtrl', function($scope, $state, $ionicViewService) {
  window.localStorage['didTutorial'] = false;// For Test
  var startApp = function() {
    $ionicViewService.clearHistory();
    // 默认进入“今天”的任务列表
    $state.go('tab.tabs.dash', {groupId: -3});
    window.localStorage['didTutorial'] = true;
  };
  if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    // 向导页面只显示一次
    startApp();
  } else {
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 750);
  }
  // "立即体验"按钮Event
  $scope.gotoMain = function() {
    startApp();
  }
  $scope.slideHasChanged = function(index) {
  };
})
//主页面上下拉
.controller('CommentCtrl', function($scope,$stateParams,CommentList,$http) {
   console.log("测试Post传输模式");
     $http.post("http://10.192.164.102/learn/version.php").success(function(data){ 
     console.log(data.msg);
   });
    $scope.comments = [];
    CommentList.get($stateParams.commentId).then(function(items){
    $scope.comments = items;
    });
})
.controller('DashCtrl', function($scope,$http,InformList) {
  $scope.refresh={ judje:true}
    $scope.items = [];
    InformList.GetFeed().then(function(it){
    $scope.items = it;
   });
   $scope.doRefresh = function() {
    InformList.GetNewUser().then(function(it){
      $scope.items =$scope.items.concat(it);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
 $scope.loadMore = function() {
    InformList.GetMoreUser().then(function(it){
      $scope.items = $scope.items.concat(it);
      if(it.length < 1 )
      {
        $scope.refresh.judje=false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
})
.controller('ChatsCtrl', function($scope,HelpTalk,$ionicModal,$ionicSlideBoxDelegate,Lookimage) {
   $scope.talkHelp = [];
  HelpTalk.all().then(function(it){
     $scope.talkHelp  = it;
   });
  $scope.imageshide=true;
 $scope.shouBigImage = function (imageName,images) {  //传递一个参数（图片的URl）
  
    $scope.Url = imageName;                 //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
    $scope.bigImage = true;                   //显示大图
      $scope.modal.show();
      $scope.imageName=imageName;
      $scope.images=images;
      $ionicSlideBoxDelegate.$getByHandle('imagesview').update();
      Lookimage.showimage();
};
 $scope.closeview = function(chat) {
      $scope.closeModal();
  };
$scope.bigImage = false;    //初始默认大图是隐藏的
$scope.hideBigImage = function () {
    $scope.bigImage = false;
};
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  $ionicModal.fromTemplateUrl('templates/lookbigimage.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
   $scope.openModal = function(){
    $scope.modal.show();

  }
  $scope.closeModal = function(){
    $scope.modal.hide();
    // $scope.pictures=[];
  }

})

//login popup
.controller('LoginCtrl', function($scope, $rootScope,$ionicModal, $timeout,$http,headimage,inputvalidate) {
  // Form data for the login modal
  // Create the login modal that we will use later
  $rootScope.loginData = {};
  $rootScope.loginData.loginimage=headimage;
  $scope.loginagain=true;
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();//隐藏菜单
  };

  // Open the login modal
  $scope.login = function() {
    if($scope.loginagain==true)
    {
       $scope.modal.show();
    }
    else
    {
     alert("你已登录无需再登");
    }
  };
  $scope.doLogin = function() {
    console.log('Doing login', $rootScope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 2000);
  };
 $scope.loginbutton = function() {
   // var re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字  
   // !re.test(nubmer)//是否为数字
   $n=3;
  if(!isNaN($rootScope.loginData.username))
  {
    if(inputvalidate.is_mobile($rootScope.loginData.username))
      {
        $n=1;
        console.log("手机号");
      }
      else
      {
        console.log("手机号错误");
      }

  }
  if($rootScope.loginData.username.indexOf('@')!=-1)
  {
    alert($rootScope.loginData.username.indexOf('@'));
     if(inputvalidate.is_email($rootScope.loginData.username))
      {
        $n=2;
        console.log("邮箱");
      }
      else
      {
       $n=2;
      }
  }
 if(inputvalidate.is_user($rootScope.loginData.username)&&!$rootScope.loginData.username.indexOf('@'))
 {
    $n=0;
 }
  $http.get("http://10.192.164.102/learn/manager_users.php",{params:{name:$rootScope.loginData.username,userpssword:$rootScope.loginData.password,n:$n,kind:"querylogin"}}).success(function(data){ 
     $scope.user=data;
    // $scope.user=JSON.stringify(data); 
    // $scope.results=angular.fromJson("OK");
    if($scope.user.kind=="OK")
    {
      $rootScope.loginData.loginimage=$scope.user.headimage;
      $scope.menuLogin.menuimage=$scope.user.headimage;
      $scope.menuLogin.menulogintext="欢迎"+$scope.user.nickname+"回来";
      $rootScope.loginoutcrtl=$rootScope.loginData.username;
      $scope.modal.hide();//隐藏菜单
      $scope.loginagain=false;
    }
    else
    {
      $rootScope.loginData.error="用户名或密码错误";
    }
   },function(error)
   {
    alert(error);
   });

  };
})
.controller('LoginOutCtrl', function($scope,OpenCamera) {
 
  $scope.LoginOut = function() {
      ionic.Platform.exitApp();
   }
})
.controller('menuCtrl', function($scope,UpdateApk,obtainheadimage,$rootScope,$cordovaFile,$timeout) {
  $scope.menuLogin={menuimage:"img/logo-s.png",menulogintext:"登录/注册"};

  UpdateApk.UpdateVersionApk();
   $scope.changeheadimage = function() {
    if($rootScope.loginData.username==undefined)
     {
        alert("请先登录后再换头像");
        return;
     } 
     else
     {
        obtainheadimage.showConfirm($rootScope.loginData.username).then(function(it){
           $scope.menuLogin.menuimage=it;
           $rootScope.loginData.loginimage=it;

        });
     }
  }
  $scope.updateclick=function()
    {
      $scope.click=new Date();
      $timeout(function() {
        $scope.updateclick();
      }, 1000);
    }
    $scope.updateclick();
})

.controller('LogInOut', function() {
  $scope.login = function() {
     alert("LogInOut") ;
   }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('DashDetailCtrl', function($scope, $stateParams, InformList) {
  $scope.dash = InformList.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('IndexMenu', function($scope) {
 
  $scope.MenuSet = function() {
     alert("你是");
  };
})

.controller('ContentController', function($scope,$ionicSideMenuDelegate) {
 
   $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
//测试弹出框
.controller('TextCtrl', function($scope, $ionicPopup, $timeout) {
   // 触发一个按钮点击，或一些其他目标
 $scope.showPopup = function() {
   $scope.data = {}

   // 一个精心制作的自定义弹窗
   var myPopup = $ionicPopup.show({
     template: '<input type="text" ng-model="data.wifi"><br><input type="password" ng-model="data.wifi">',
     title: '输入密码',
     subTitle: '填写信息',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.wifi) {
             //不允许用户关闭，除非他键入wifi密码
             e.preventDefault();
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   // $timeout(function() {
   //    myPopup.close(); //由于某种原因3秒后关闭弹出
   // }, 3000);

   // 一个确认对话框
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '欢迎回来',
       template: '确定清理'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('已清理');
       } else {
         console.log('清理未遂');
       }
     });
   };

   // 一个提示对话框
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: '对话框',
       template: '提示对话框'
     });
     alertPopup.then(function(res) {
       console.log('谢谢登录');
     });
   };
 };
})

 // 拍照页面模拟
.controller('TakePhotoCtrl', function($scope, $ionicModal,UpdateApk) {
  $ionicModal.fromTemplateUrl('templates/takephoto.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function(){
    // $scope.modal.show();
    UpdateApk.UpdateVersionApk();
  }
  $scope.closeModal = function(){
    $scope.modal.hide();
  }
})
.controller('seekhelp', function(UpdateServe,$scope,$http,$cordovaMedia,$ionicActionSheet,$cordovaCapture,$timeout, $state, $ionicLoading, $cordovaImagePicker, $cordovaCamera,$ionicModal,$cordovaFileTransfer,$rootScope) {
   $ionicModal.fromTemplateUrl('templates/takephoto.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
     $scope.openModal = function(){
    $scope.modal.show(); 
     }
  $scope.closeModal = function(){
    $scope.modal.hide();
  }
    })
.controller('IndexPhoto', function(UpdateServe,$cordovaGeolocation,$scope,$http,$cordovaMedia,$ionicActionSheet,$cordovaCapture,$timeout, $state, $ionicLoading, $cordovaImagePicker, $cordovaCamera,$ionicModal,$cordovaFileTransfer,$rootScope) {
    $rootScope.update={};
    $scope.pictures = [];
    $scope.judjeshow={}
   $rootScope.update.path="img\mov_bbb.mp4";
    $rootScope.update.mediahide=true;
    $rootScope.update.mediashow=false;
    var n=0;
 $ionicModal.fromTemplateUrl('templates/takephoto.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function(){
    $scope.modal.show();
  }
  $scope.closeModal = function(){
    $scope.modal.hide();
    // $scope.pictures=[];
  }
  $scope.maplocation= function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      alert(position);
    }, function(err) {
      // error
    });
  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };
  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
  });
  watch.clearWatch();
  // OR
  $cordovaGeolocation.clearWatch(watch)
    .then(function(result) {
      // success
      }, function (error) {
      // error
    });
  }
  $scope.updatePhoto = function(){//上传说说附加的相片
   if($rootScope.loginData.username==undefined)
     {
        alert("请先登录后再做评论");
        return;
     } 
     var errorCount = 0;
      n=0;
     var success = function (r) {
         errorCount += 1;
     };
     var error = function (error) {
         errorCount += 1;
         alert("提示"+"第" + errorCount + "张图片上传失败！上传终止！");
         return;
     };
    var element = document.getElementById("AssistIextName");
    $scope.commentText=element.value;
    $scope.Text="";
    if($rootScope.update.path==undefined)
    {
        $scope.Text=null;
    }
    else
    {
       $scope.Text="true";

    }
    $http.get("http://10.192.164.102/learn/manager_comment.php",{params:{name:$rootScope.loginData.username,commentText:$scope.commentText,media:$scope.Text,Kind:"insert"}}).success(function(data){ 
    $scope.comment=data;
    if($scope.comment.kind=="OK"&&$scope.comment.id!=undefined)
    {
       alert("说说编码："+$scope.comment.id+"于"+$scope.comment.date+"发表成功");
        for (var i = 0; i < $scope.pictures.length; i++) {
         if ($scope.pictures[i] != "") {
             var imgUrl = $scope.pictures[i];
             UpdateServe.FileTransferupLoad(imgUrl, success, error,$scope.comment.id);
         }
      }   
        $scope.pictures=[];
    }
    else
    {
       alert("说说发表未遂:");
    }
   });  
 }
  $scope.TakePhoto = function(prop) {
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: '<b>拍照</b> 上传'
      }, {
        text: ' <b>相册</b> 上传'
      }, {
        text: ' <b>拍摄视频</b> 上传'
      }],
      cancelText: '取 消',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        // 相册文件选择上传
        if (index == 1) {
         $scope.readalbum(prop);
         $rootScope.update.mediahide=true;
          $rootScope.update.mediashow=false;
        } else if (index == 0) {
          // 拍照
          $rootScope.update.mediahide=true;
            $rootScope.update.mediashow=false;
         $scope.taskPicture(prop);
        } else if(index == 2)
        {
            $rootScope.update.mediahide=false;
             $rootScope.update.mediashow=true;
             $scope.captureVideo();
        }
        return true;
      }
    });
  };
  //录像
  $scope.captureVideo = function() {
    var options = { limit: 1, duration: 15 };
    $cordovaCapture.captureVideo(options).then(function(videoData) {
      $rootScope.update.path=videoData[0].fullPath;
      $scope.pictures[0]=videoData[0].fullPath;
      $scope.openModal();
    }, function(err) {
     alert("captureVideo"+videoData);
    });
  }
  // 拍照
  $scope.taskPicture = function(prop) {
    if (!navigator.camera) {
      return;
    }
    document.addEventListener("deviceready", function () {
       var options = {
        quality: 50,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
        allowEdit: false,                                        //在选择之前允许修改截图
        encodingType:Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 200,                                        //照片宽度
        targetHeight: 200,                                       //照片高度
        mediaType:0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        // cameraDirection:0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        saveToPhotoAlbum: false               
       };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      $scope.openModal();
      $scope.pictures[n]=imageURI;
      n=$scope.pictures.length;
      if(n>6)
      {
        n=0;
      }
    }, function(err) {
    });
 }, false);};
  $scope.readalbum = function(prop) {
    if (!window.imagePicker) {
       alert('目前您的环境不支持相册上传。');
      return;
    }
    var options = {
      minimumImagesCount: 1,
      maximumImagesCount: 6,
      width: 100,
      height: 100,
      quality: 80
    };
    $cordovaImagePicker.getPictures(options).then(function(results) {
      if(results.length>0) 
      {
        for(var i=0;i<results.length;i++)
        {
           $scope.pictures[n+i]=results[i]; 
         }
         n=$scope.pictures.length;
         $scope.openModal();
      }
      
    }, function(error) {
    });
  };
});
