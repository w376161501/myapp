
angular.module('starter.myfilter', [])
.filter('capitalize',function(){
	return function(input){
		if(input)
		{
			return input[0].toUpperCase()+input.slice(1);
		}
	}
})
.filter('subber',function(){
	      return function(input,uppercase){
                    var out = "";
                    for(var i=0 ; i<input.length; i++){
                        out = input.charAt(i)+out;
                    }
                    if(uppercase){
                        out = out.toUpperCase();
                    }
                    return out;
                }
            })
