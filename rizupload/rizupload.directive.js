import axios from 'axios';
/*
* CaraPake:
*
*  multiple:
*  single:
*  <div rizupload kelas="btn bt-sm btn-success" target="profile" multiple id="monyet" text="upload foto" icon="fa fa-cloud-upload"></div>
*  endpoint :
*  profilepic,
*/
export default function(conf,$cookies,$timeout) {
    return {
      restrict: 'A',
      scope: { multiple:'=', target:'=', id:'='},
      link: function (scope, element, attrs) {
        //console.log("me: ->",attrs.me)
        var target = attrs.target
        var me = JSON.parse(attrs.me)

        /*
          Set Endpoint
        */
        var endpoint = ''
        if(target=='profilepic'){
          endpoint = conf.profilepic+'?username='+me.username+'&session='+me.session
        }

        //mulai dari sini
        var echo = document.getElementById(attrs.id);
        var txt = attrs.text
        if(txt==undefined){
          txt = 'Upload File'
        }
        var icon = attrs.icon
        if(icon==undefined){
          icon = 'fa fa-cloud-upload'
        }
        var kelas = attrs.kelas
        if(kelas==undefined){
          kelas = 'btn btn-info'
        }
        //cek multiple / single
        echo.innerHTML = '<div class="uploadbox">'
        if(attrs.multiple!==undefined){
          echo.innerHTML += '<div class="uploafl"><div class="'+kelas+'"><i class="'+icon+'"></i> '+txt+'<input type="file" class="btn-file" multiple /></div>'
        }else{
          echo.innerHTML += '<div class="uploafl"><div class="'+kelas+'"><i class="'+icon+'"></i> '+txt+'<input type="file" class="btn-file"  /></div>'
        }
        echo.innerHTML += '<div id="uproses"></div>'

        const myUploadProgress = (file,i) => (progress) => {
          let percentage = Math.floor((progress.loaded * 100) / progress.total)
          var s = 'progress-bar-info'
          if(percentage==100){
            s = 'progress-bar-success'
          }
          document.getElementById('mtx'+i).innerHTML =
          '<div class="progress" style="float:left;width:100%"><div class="progress-bar '+s+'" role="progressbar" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width:'+percentage+'%">'+
            '<span>'+percentage+'% Complete</span>'+
          '</div></div><span style="margin-top:-10px;float:left;width:100%">'+file.name+' <small class="pull-right">'+formatBytes(file.size)+'</small></span>'
        }
        element.bind("change", function(e) {
          var files = (e.srcElement || e.target).files;
          var antri = document.getElementById('uproses');
          antri.innerHTML = ""
          for (var i=0; i<files.length; i++) {
            //console.log('files',files[i].name)
            antri.innerHTML += '<div class="uque" id="mtx'+i+'">'+i+' - '+files[i].name+'</div>'
            //axios in action
            var config = {
              //headers: {'Content-Type': 'text/plain'},
              //responseType: 'json', // default
              onUploadProgress: myUploadProgress(files[i],i)
            };
            var data = new FormData();
            data.append('file', files[i]);
            axios.post('//'+endpoint,data,config).then((r)=>{
              var res = r.data
              if(res.status=='success'){


                /*
                  Action dari sini
                */
                if(target=='profilepic'){
                  var me = JSON.parse($cookies.get('me'))
                  me.avatar = res.uid
                  $cookies.put('me',JSON.stringify(me))
                  //reload page
                  $timeout(()=>{
                    location.reload('./?oke');
                  },2000)
                }

              }
            });

          }
        });
        echo.innerHTML += '</div>'
      }
    }
}


function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
