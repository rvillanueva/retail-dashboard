"use strict";angular.module("socialApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap"]).config(["$routeProvider","$locationProvider","$httpProvider",function(a,b,c){a.otherwise({redirectTo:"/"}),b.html5Mode(!0),c.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$routeChangeStart",function(a,d){c.isLoggedInAsync(function(a){d.authenticate&&!a&&b.path("/login")})})}]),angular.module("socialApp").config(["$routeProvider",function(a){a.when("/login",{templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).when("/signup",{templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).when("/settings",{templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("socialApp").controller("LoginCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.login=function(d){a.submitted=!0,d.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){a.errors.other=b.message})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("socialApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("socialApp").controller("SignupCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.register=function(d){a.submitted=!0,d.$valid&&b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("socialApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("socialApp").config(["$routeProvider",function(a){a.when("/admin",{templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("socialApp").filter("ongoingEvent",function(){return function(a){var b=[],c=new Date,d=c.setDate(c.getDate()),e=c.setDate(c.getDate()+1);return angular.forEach(a,function(a){a.start_time<d&&a.end_time>=e&&b.push(a)}),b}}),angular.module("socialApp").filter("todayEvent",function(){return function(a){var b=[],c=new Date,d=c.setDate(c.getDate()),e=c.setDate(c.getDate()+1);return angular.forEach(a,function(a){a.start_time>d&&a.start_time<e&&(a.end_time<=e||!a.end_time)&&b.push(a)}),b}}),angular.module("socialApp").filter("upcomingEvent",function(){return function(a){var b=[],c=new Date,d=(c.setDate(c.getDate()),c.setDate(c.getDate()+1));return angular.forEach(a,function(a){a.start_time>d&&b.push(a)}),b}}),angular.module("socialApp").controller("MainCtrl",["$scope","$http","socialFactory","authFactory","$modal","$window",function(a,b,c,d,e,f){a.now=new Date,a.day=a.now.getDay(),a.today=a.now.setDate(a.now.getDate()),a.tomorrow=a.now.setDate(a.now.getDate()+1),a.init=function(b){c.init(b,a.user).then(function(b){console.log(b),a.tweets=b.tweets,a.store=b.store,a.fbEvents=b.fbEvents})},d.getMe().then(function(b){console.log(b),a.user=b,a.user.settings||(a.user.settings={}),a.user.settings.store?(a.storeSelected=!0,a.init(a.user.settings.store)):a.storeSelected=!1}),a.getEvents=function(){d.getMe().then(function(b){var d={token:b.fbtoken};c.fbEvents(d).then(function(b){a.fbEvents=b,console.log(b)})})},a.fbAuth=function(){c.fbAuth()},a.loginOauth=function(a){f.location.href="/auth/"+a},a.storeSelect=function(){var b=e.open({templateUrl:"../components/selectmodal/selectmodal.html",controller:"SelectModalInstanceCtrl",size:"lg",backdrop:!0});b.result.then(function(b){b&&(console.log(b),a.storeSelected=!0,a.init(b),d.saveStore(b))})}}]),angular.module("socialApp").config(["$routeProvider",function(a){a.when("/",{templateUrl:"app/routes/main/main.html",controller:"MainCtrl"})}]),angular.module("socialApp").controller("MapCtrl",["$scope","authFactory","socialFactory",function(a,b,c){function d(){var a={center:{lat:41.809623,lng:-87.991943},zoom:14};e=new google.maps.Map(document.getElementById("map-canvas"),a)}var e;a.tweets=[],a.events=[],a.poi=[];var f=function(b,c){var d=new google.maps.LatLng(b.lat,b["long"]),f=new google.maps.Marker({position:d,map:e,animation:google.maps.Animation.DROP,icon:"/assets/images/4169a7da.tweet2.png",info:c}),g=new google.maps.InfoWindow({content:c.body});google.maps.event.addListener(f,"click",function(){g.open(e,f)}),a.tweets.push(f)},g=function(b,c){var d=new google.maps.LatLng(b.lat,b["long"]),f=new google.maps.Marker({position:d,map:e,title:c.title,animation:google.maps.Animation.DROP,info:c});e.setCenter(f.getPosition()),a.store=f};a.init=function(b){c.init(b,a.user).then(function(b){console.log(b),a.tweets=b.tweets,a.store=b.store,a.fbEvents=b.fbEvents;var c={lat:a.store.location.coordinate.latitude,"long":a.store.location.coordinate.longitude},d={title:a.store.name,body:""+a.store.location.address[0]+", "+a.store.location.city+", "+a.store.location.state_code};g(c,d),angular.forEach(a.tweets,function(a){var b={lat:a.geo.coordinates[0],"long":a.geo.coordinates[1]},c={title:a.user.name,body:a.text};f(b,c)})})},b.getMe().then(function(b){console.log(b),a.user=b,a.user.settings||(a.user.settings={}),a.user.settings.store?(a.storeSelected=!0,a.init(a.user.settings.store)):a.storeSelected=!1}),d()}]),angular.module("socialApp").config(["$routeProvider",function(a){a.when("/map",{templateUrl:"app/routes/map/map.html",controller:"MapCtrl"})}]),angular.module("socialApp").factory("authFactory",["$q","$http",function(a,b){return{getMe:function(){var c=a.defer();return b({url:"api/users/me",method:"GET"}).success(function(a){c.resolve(a)}),c.promise},saveStore:function(c){var d=a.defer();return b.post("/api/users/store",{store:c}).success(function(a){console.log("store saved"),d.resolve(a)}),d.promise}}}]),angular.module("socialApp").factory("mapFactory",function(){return{initialize:function(){initialize()}}}),angular.module("socialApp").factory("socialFactory",["$q","$http","$timeout","authFactory",function(a,b,c,d){function e(a,b,c,d){var e=6371,g=f(c-a),h=f(d-b),i=Math.sin(g/2)*Math.sin(g/2)+Math.cos(f(a))*Math.cos(f(c))*Math.sin(h/2)*Math.sin(h/2),j=2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i)),k=e*j;return k}function f(a){return a*(Math.PI/180)}var g={tweets:{retrieved:null,params:null,data:null},yelpCompetition:{retrieved:null,params:null,data:null},store:{retrieved:null,params:null,data:null},fbEvents:{retrieved:null,params:null,data:null}},h=12e4,i=function(a){var b=new Date((a||"").replace(/-/g,"/").replace(/[TZ]/g," ")),c=((new Date).getTime()-b.getTime())/1e3,d=Math.floor(c/86400);if(!(isNaN(d)||0>d||d>=31))return 0==d&&(60>c&&"just now"||120>c&&"1 minute ago"||3600>c&&Math.floor(c/60)+" minutes ago"||7200>c&&"1 hour ago"||86400>c&&Math.floor(c/3600)+" hours ago")||1==d&&"Yesterday"||7>d&&d+" days ago"||31>d&&Math.ceil(d/7)+" weeks ago"},j=function(c,d){var f=a.defer(),j=new Date;return console.log(c),console.log(g),g.tweets.retrieved<j-h||!g.tweets.retrieved||c.geocode!==g.tweets.params.geocode?b({url:"/api/twitter/search",method:"GET",params:c}).success(function(a){var b=a;angular.forEach(b.statuses,function(a){var b=a.created_at;if(a.created_at=new Date(b),a.created_ago=i(b),a.user.profile_url="http://twitter.com/"+a.user.screen_name,d&&a.geo){var c=e(d.lat,d["long"],a.geo.coordinates[0],a.geo.coordinates[1]);a.geo.distance=.621371*c}}),g.tweets={retrieved:new Date,params:c,data:a},f.resolve(b)}):f.resolve(g.tweets.data),f.promise},k=function(){var c=a.defer();return b({url:"/api/facebook/auth",method:"GET"}).success(function(a){c.resolve(a)}),c.promise},l=function(c){var d=a.defer(),e=new Date,f=0;console.log(c);var i=function(a){console.log("retrieving events "+f+" time"),b({url:"/api/facebook/events",method:"GET",params:a}).success(function(b){console.log(b),b.data.length>0?(angular.forEach(b.data,function(a){a.original={start_time:a.start_time,end_time:a.end_time},a.start_time=new Date(a.start_time),a.end_time=new Date(a.end_time)}),g.fbEvents={retrieved:new Date,params:a,data:b},d.resolve(b)):(console.log("rejecting"),d.resolve(b))})};return g.fbEvents.retrieved<e-h||!g.fbEvents.retrieved||c.q!==g.fbEvents.params.q?i(c):d.resolve(g.fbEvents.data),d.promise},m=function(c){var d=a.defer();return b({url:"/api/yelp/search",method:"GET",params:c}).success(function(a){d.resolve(a)}),d.promise},n=function(c){var d=a.defer(),e=new Date,f={id:c};return g.store.retrieved<e-h||!g.store.retrieved||c!==g.store.params.id?b({url:"/api/yelp/business",method:"GET",params:f}).success(function(a){g.store={retrieved:new Date,params:f,data:a},d.resolve(a)}):d.resolve(g.store.data),d.promise};return{twitterSearch:function(b,c){var d=a.defer();return j(b,c).then(function(a){d.resolve(a)}),d.promise},fbAuth:function(){var b=a.defer();return k().then(function(a){b.resolve(a)}),b.promise},fbEvents:function(b){var c=a.defer();return l(b).then(function(a){c.resolve(a)}),c.promise},yelpSearch:function(b){var c=a.defer();return m(b).then(function(a){c.resolve(a)}),c.promise},yelpBusiness:function(b){console.log(b);var c=a.defer();return n(b).then(function(a){c.resolve(a)}),c.promise},init:function(b){console.log(b);var c=a.defer(),e={tweets:null,fbEvents:null,store:null};return n(b).then(function(a){console.log(a);var b=a;e.store=b;var f={q:"mcdonalds",geocode:""+b.location.coordinate.latitude+","+b.location.coordinate.longitude+",15mi"},g={lat:b.location.coordinate.latitude,"long":b.location.coordinate.longitude};j(f,g).then(function(a){console.log(a),e.tweets=a.statuses,d.getMe().then(function(a){if(a.settings.fbtoken){var d={token:a.settings.fbtoken,q:'"'+b.location.city+", "+b.location.state_code+'"'};l(d).then(function(a){e.fbEvents=a.data,console.log(a),c.resolve(e)})}else c.resolve(e)})})}),c.promise}}}]),angular.module("socialApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("socialApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("socialApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("socialApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("socialApp").controller("NavbarCtrl",["$scope","$location","Auth",function(a,b,c){a.menu=[{title:"Dashboard",link:"/"},{title:"Map",link:"/map"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}]),angular.module("socialApp").controller("SelectModalInstanceCtrl",["$scope","$http","$modalInstance","socialFactory",function(a,b,c,d){a.ok=function(){c.close(a.store)},a.select=function(a){c.close(a)},a.search=function(){if(a.location){var b={term:"mcdonalds",location:a.location};d.yelpSearch(b).then(function(b){console.log(b),a.searchData=b,a.stores=b.businesses})}else alert("Please enter a location!")},a.cancel=function(){c.dismiss("cancel")},a.clear=function(){a.addText.date=null},a.open=function(b){b.preventDefault(),b.stopPropagation(),a.opened=!0}}]),angular.module("socialApp").factory("SelectModal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/selectmodal/selectmodal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("socialApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Login</h1>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="login(form)" novalidate>\n\n        <div class="form-group">\n          <label>Email</label>\n\n          <input type="email" name="email" class="form-control" ng-model="user.email" required>\n        </div>\n\n        <div class="form-group">\n          <label>Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="user.password" required>\n        </div>\n\n        <div class="form-group has-error">\n          <p class="help-block" ng-show="form.email.$error.required && form.password.$error.required && submitted">\n             Please enter your email and password.\n          </p>\n          <p class="help-block" ng-show="form.email.$error.email && submitted">\n             Please enter a valid email.\n          </p>\n\n          <p class="help-block">{{ errors.other }}</p>\n        </div>\n\n        <div>\n          <button class="btn btn-inverse btn-lg btn-login" type="submit">\n            Login\n          </button>\n          <a href="/signup">\n            Create Account\n          </a>\n        </div>\n\n        <hr>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Change Password</h1>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="changePassword(form)" novalidate>\n\n        <div class="form-group">\n          <label>Current Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="user.oldPassword"\n                 mongoose-error/>\n          <p class="help-block" ng-show="form.password.$error.mongoose">\n              {{ errors.other }}\n          </p>\n        </div>\n\n        <div class="form-group">\n          <label>New Password</label>\n\n          <input type="password" name="newPassword" class="form-control" ng-model="user.newPassword"\n                 ng-minlength="3"\n                 required/>\n          <p class="help-block"\n             ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">\n            Password must be at least 3 characters.\n          </p>\n        </div>\n\n        <p class="help-block"> {{ message }} </p>\n\n        <button class="btn btn-lg btn-primary" type="submit">Save changes</button>\n      </form>\n    </div>\n  </div>\n</div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n  <div class="row">\n    <div class="col-sm-12">\n      <h1>Sign up</h1>\n    </div>\n    <div class="col-sm-12">\n      <form class="form" name="form" ng-submit="register(form)" novalidate>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }">\n          <label>Name</label>\n\n          <input type="text" name="name" class="form-control" ng-model="user.name"\n                 required/>\n          <p class="help-block" ng-show="form.name.$error.required && submitted">\n            A name is required\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }">\n          <label>Email</label>\n\n          <input type="email" name="email" class="form-control" ng-model="user.email"\n                 required\n                 mongoose-error/>\n          <p class="help-block" ng-show="form.email.$error.email && submitted">\n            Doesn\'t look like a valid email.\n          </p>\n          <p class="help-block" ng-show="form.email.$error.required && submitted">\n            What\'s your email address?\n          </p>\n          <p class="help-block" ng-show="form.email.$error.mongoose">\n            {{ errors.email }}\n          </p>\n        </div>\n\n        <div class="form-group" ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }">\n          <label>Password</label>\n\n          <input type="password" name="password" class="form-control" ng-model="user.password"\n                 ng-minlength="3"\n                 required\n                 mongoose-error/>\n          <p class="help-block"\n             ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">\n            Password must be at least 3 characters.\n          </p>\n          <p class="help-block" ng-show="form.password.$error.mongoose">\n            {{ errors.password }}\n          </p>\n        </div>\n\n        <div>\n          <button class="btn btn-inverse btn-lg btn-login" type="submit">\n            Sign up\n          </button>\n          <a href="/login">\n            Login\n          </a>\n        </div>\n\n        <hr>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n  <p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p>\n  <ul class="list-group">\n    <li class="list-group-item" ng-repeat="user in users">\n        <strong>{{user.name}}</strong><br>\n        <span class="text-muted">{{user.email}}</span>\n        <a ng-click="delete(user)" class="trash"><span class="glyphicon glyphicon-trash pull-right"></span></a>\n    </li>\n  </ul>\n</div>'),a.put("app/routes/main/main.html",'<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<header class="hero-unit" id="banner">\n  <div class="container">\n    <div ng-if="store && store.image_url">\n      <img ng-src="{{store.image_url}}" class="img-circle"></img>\n      <br>\n    </div>\n    <h1>{{now | date:"EEEE"}}</h1>\n    <p class="lead">{{now | date: "h:mma"}}&nbsp;&nbsp;&nbsp;&nbsp;{{now | date:"MMMM d, yyyy"}}</p>\n    <div ng-if="store">\n      {{store.location.address[0]}}, {{store.location.city}}, {{store.location.state_code}}, {{store.location.country_code}} <a class="clickable" ng-click="storeSelect()" ><span class="glyphicon glyphicon-cog"></span></a>\n    </div>\n    <div ng-if="!store">\n      <button class="btn btn-primary" ng-click="storeSelect()" >Select Store</button>\n    </div>\n  </div>\n</header>\n<div class="container">\n  <div class="row" ng-if="storeSelected">\n    <br>\n    <div class="col-lg-12">\n      <div class="col-lg-4">\n        <div class="panel panel-default">\n          <div class="panel-heading">\n            Events\n          </div>\n          <div class="panel-body">\n            <a class="btn btn-facebook" ng-if="!fbAuth" ng-click="loginOauth(\'facebook\')">\n              <i class="fa fa-facebook"></i> Connect with Facebook\n            </a>\n            <div ng-if="fbAuth">\n              <h4>Today:</h4>\n              <div ng-repeat="event in todaysEvents = (fbEvents | orderBy: \'start_time\' | todayEvent)">\n                <strong>{{event.name}}</strong><br>\n                {{event.start_time | date:"medium"}}<span ng-hide="event.end_time"> - {{event.end_time | date:"medium"}}</span><br>\n                {{event.location}}\n                <br><br>\n              </div>\n              <div ng-show="todaysEvents.length == 0">No events found for today.<br><br></div>\n              <h4>Ongoing:</h4>\n              <div ng-repeat="event in ongoingEvents = (fbEvents | orderBy: \'start_time\' | ongoingEvent)">\n                <strong>{{event.name}}</strong><br>\n                {{event.start_time | date:"medium"}} - {{event.end_time | date:"medium"}}<br>\n                {{event.location}}\n                <br><br>\n              </div>\n              <div ng-show="ongoingEvents.length == 0">No ongoing events found.<br><br></div>\n              <h4>Upcoming:</h4>\n              <div ng-repeat="event in upcomingEvents = (fbEvents | orderBy: \'start_time\' | upcomingEvent | limitTo:5)">\n                <strong>{{event.name}}</strong><br>\n                {{event.start_time | date:"short"}}<span ng-hide="event.end_time"> - {{event.end_time | date:"short"}}</span><br>\n                {{event.location}}\n                <br><br>\n              </div>\n              <div ng-show="upcomingEvents.length == 0">No upcoming events found.<br><br></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="col-lg-8">\n        <div class="panel panel-default">\n          <div class="panel-heading">\n            Customer Satisfaction\n          </div>\n          <div class="panel-body">\n            <div class="pull-left padded-thumb">\n              <img ng-src="{{store.image_url}}" ng-if="store.image_url"><br>\n            </div>\n            <div>\n              <a ng-href="{{store.url}}"><strong>{{store.name}}</strong></a><br>\n              <img ng-src="{{store.rating_img_url}}"><br>\n              {{store.review_count}} reviews\n            </div>\n          </div>\n        </div>\n        <div class="panel panel-default">\n          <div class="panel-heading">\n            Social\n          </div>\n          <div class="panel-body">\n            <div class="panel" ng-repeat="tweet in tweets | limitTo:5">\n              <div class="panel-body">\n                <div class="tweet-avatar">\n                  <img ng-src="{{tweet.user.profile_image_url}}" class="img-rounded padded-thumb">\n                </div>\n                <div class="tweet-box">\n                  <div class="tweet-text">\n                    <div><strong><a ng-href="{{tweet.user.profile_url}}">{{tweet.user.name}}</img></a></strong>\n                      <div class="pull-right">\n                        {{tweet.created_ago}}\n                      </div>\n                    </div>\n                    {{tweet.text}}<br>\n                  </div>\n                  <div class="tiny-text" ng-if="tweet.geo"><span class="glyphicon glyphicon-map-marker"></span> {{tweet.place.full_name}} <span ng-if="tweet.geo.distance">({{tweet.geo.distance | number: 1}} mi away)</span><br></div>\n                  <div ng-if="tweet.entities.media.length > 0">\n                    <img ng-src="{{tweet.entities.media[0].media_url}}" class="img-responsive img-rounded"></img>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<footer class="footer">\n  <div class="container">\n      <p>&copy; </p>\n  </div>\n</footer>\n'),a.put("app/routes/map/map.html",'<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n  <div id="map-canvas">\n  </div>\n</div>\n\n<footer class="footer">\n  <div class="container">\n      <p>IBM Research THINKLab</p>\n  </div>\n</footer>\n'),a.put("components/modal/modal.html",'<div class="modal-header">\n  <button ng-if="modal.dismissable" type="button" ng-click="$dismiss()" class="close">&times;</button>\n  <h4 ng-if="modal.title" ng-bind="modal.title" class="modal-title"></h4>\n</div>\n<div class="modal-body">\n  <input type="text" ng-model="location" placeholder="Location"></input><button class="btn btn-primary">Search</button>\n  <br><br>\n  <div class="panel" ng-repeat="store in stores">\n    <div class="panel-heading"><span ng-repeat="line in store.location.display_address"{{line}}, </span></div>\n  </div>\n</div>\n<div class="modal-footer">\n  <button ng-repeat="button in modal.buttons" ng-class="button.classes" ng-click="button.click($event)" ng-bind="button.text" class="btn"></button>\n</div>\n'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller="NavbarCtrl">\n  <div class="container">\n    <div class="navbar-header">\n      <button class="navbar-toggle" type="button" ng-click="isCollapsed = !isCollapsed">\n        <span class="sr-only">Toggle navigation</span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n      </button>\n      <a href="/" class="navbar-brand">my store</a>\n    </div>\n    <div collapse="isCollapsed" class="navbar-collapse collapse" id="navbar-main">\n      <ul class="nav navbar-nav">\n        <li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}">\n            <a ng-href="{{item.link}}">{{item.title}}</a>\n        </li>\n        <li ng-show="isAdmin()" ng-class="{active: isActive(\'/admin\')}"><a href="/admin">Admin</a></li>\n      </ul>\n\n      <ul class="nav navbar-nav navbar-right">\n        <li ng-hide="isLoggedIn()" ng-class="{active: isActive(\'/signup\')}"><a href="/signup">Sign up</a></li>\n        <li ng-hide="isLoggedIn()" ng-class="{active: isActive(\'/login\')}"><a href="/login">Login</a></li>\n        <li ng-show="isLoggedIn()"><p class="navbar-text">Hello {{ getCurrentUser().name }}</p> </li>\n        <li ng-show="isLoggedIn()" ng-class="{active: isActive(\'/settings\')}"><a href="/settings"><span class="glyphicon glyphicon-cog"></span></a></li>\n        <li ng-show="isLoggedIn()" ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click="logout()">Logout</a></li>\n      </ul>\n    </div>\n  </div>\n</div>\n'),a.put("components/selectmodal/selectmodal.html",'<div class="modal-header">\n  <button ng-if="modal.dismissable" type="button" ng-click="$dismiss()" class="close">&times;</button>\n  <h4>Select Your Store</h4>\n</div>\n<div class="modal-body">\n  <div>\n    <input type="text" ng-model="location" placeholder="City or location">&nbsp;<button class="btn btn-primary" ng-click="search()">Search</button>\n  </div>\n  <br><br>\n  <div class="panel panel-primary" ng-repeat="store in stores">\n    <div class="panel-body">\n      <div class="row">\n        <div class="col-lg-12">\n          <div class="pull-left">\n            <img ng-src="{{store.image_url}}" class="img-responsive"></img>\n          </div>\n          {{store.location.address[0]}}, {{store.location.city}}, {{store.location.country_code}}\n          <div class="pull-right">\n            <button class="btn btn-info btn-sm" ng-click="select(store.id)">Select</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="modal-footer">\n  <button ng-repeat="button in modal.buttons" ng-class="button.classes" ng-click="button.click($event)" ng-bind="button.text" class="btn"></button>\n</div>\n')}]);