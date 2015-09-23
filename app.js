(function(){
'use strict';

/*global angular */

angular.module('codeSpud',['ngAnimate'])

       .service('initSrvc', InitService)
       .controller('homePageCtrl', HomePageController );

/////////////////////////

function HomePageController ($scope, initSrvc) {
    var vm = this;
    console.log(initSrvc);
    vm.service = initSrvc;
    vm.query = '';
    vm.searchTag = searchTag;

    vm.service.getLinks().then(function(data){
        console.log('OK',data, vm.service.links);
    });

    /////////////////////
    function searchTag(tag){
        vm.query = tag;
    }
}

function InitService($http) {
    var svc = this;
    var expandUrls = [
        ['__master__', '//github.com/chrisbautista/chrisbautista.github.io/blob/master']
    ];

    this.links = {};
    this.tags = [];


    this.getLinks = function(){
       return $http.get('links.json')
        .then(function(response){
            //console.log(response);
            if(response.status===200){
                svc.links = normalizeLinks(response.data.links, expandUrls);
                svc.tags = getTags(svc.tags,svc.links);
            }
        });
    };

    //////
    function getTags(tags,svcLinks){
        var disTags = tags;
        var tmpTag = '';

        function getTagCount(item){
            var tmp = item[1].split(' ');
            for(var i=0; i<tmp.length;i++){
                tmpTag = tmp[i].replace(/\W/g, '').toLowerCase();
                //if(/[A-Z]/.test( tmpTag[0] )){
                    if(!disTags[tmpTag]){
                        disTags[tmpTag]=1;
                    }else{
                        disTags[tmpTag]++;
                    }
                //}

            }
        }

        function sortProperties(obj)
        {
            var sortable=[];
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    sortable.push([key, obj[key]]);
                }
            }

            sortable.sort(function(a, b)
            {
                return b[1]-a[1];
            });

            return sortable;
        }

        angular.forEach(svcLinks, function(item){
            angular.forEach(item.list,getTagCount);
        });


        return sortProperties(disTags).slice(0,10);

    }

    function normalizeLinks(links, definedUrls){
        var j,

            newLinks=[];

        function whichURL(url, Urls){
            var $replace;
            for(var x=0; x<Urls.length; x++){
                if(url.indexOf(Urls[x][0])!==-1){
                    $replace = Urls[x][0];
                    url = url.replace($replace, Urls[x][1]);
                }
            }
            return url;
        }

        angular.forEach(links, function(item){
            for(j=0;j<item.list.length;j++){
                item.list[j][0] = whichURL(item.list[j][0], definedUrls);
            }
            this.push(item);
        }, newLinks);


        return newLinks;
    }

}


})();

