	function showall() {
	    document.getElementById("tiles").style.display = "";
	    document.getElementById("uploader").style.display = "none";
	    // Show all Record!
	    var url = "http://interview.finly.io/receipts.json";
	    var domain = "http://interview.finly.io/";
	    var xhr = new XMLHttpRequest()
	    xhr.open('GET', url, true)
	    xhr.onload = function() {
	        var response = JSON.parse(xhr.responseText);
	        if (xhr.readyState == 4 && xhr.status == "200") {
	            console.table(response);
	            var paint = "";
	            for (var i = 0; i < response.length; i++) {
	                console.log(response[i]);
	                paint += '<li class="tile" id="tile' + response[i].id + '">\
									      <img class="image" src="' + domain + response[i].image.thumb + '"></img>\
									      <span class="title">Receipt ID: <span id="">' + response[i].id + '</span></span>\
									      <span class="amount">' + response[i].image_updated_at + '</span>\
									      <div class="row">\
									      	<div style="margin: 0px 10px;">\
									      		<i class="fa fa-pencil-square-o icono" aria-hidden="true" id="modify' + response[i].id + '" alt="Modify" onclick="modifyPUT(this.id)"></i>\
									      	</div>\
									      	<div style="margin: 0px 10px;">\
									      		<i class="fa fa-times icono" aria-hidden="true" id="' + response[i].id + '" alt="Delete" onclick="delete_item(this.id)"></i>\
									      	</div>\
									      </div>\
									    </li>'
	            }
	            document.getElementById("tiles").innerHTML = paint;
	        } else {
	            console.error(response);
	        }
	    }
	    xhr.send(null);
	}

	function upload() {
	    document.getElementById("tiles").style.display = "none";
	    document.getElementById("uploader").style.display = "block";
	    var fileCatcher = document.getElementById('file-catcher');
	    var fileInput = document.getElementById('file-input');
	    var fileListDisplay = document.getElementById('uploadHolder');
	    var template1 = '<i class="fa fa-cloud-upload fa-5x" aria-hidden="true"></i><br />\
				  <span class="title">Click here to upload your file(s)!</span><br />';
	    var template2 = '<i class="fa fa-check fa-5x" style="color: #86ff05;" aria-hidden="true"></i><br />\
				  <span class="title">Upload Successful!</span><br />';

	    var fileList = [];
	    var renderFileList, sendFile;

	    fileCatcher.addEventListener('submit', function(evnt) {
	        evnt.preventDefault();
	        fileList.forEach(function(file) {
	            sendFile(file);
	        });
	    });

	    fileInput.addEventListener('change', function(evnt) {
	        fileList = [];
	        for (var i = 0; i < fileInput.files.length; i++) {
	            fileList.push(fileInput.files[i]);
	        }
	        renderFileList();
	    });

	    renderFileList = function() {
	        preview = document.getElementById('uploadHolder');
	        preview.innerHTML = "";
	        if (this.files) {
	            [].forEach.call(this.files, readAndPreview);
	        }

	        function readAndPreview(file) {
	            if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
	                document.getElementById('uploadHolder').innerHTML = template1;
	                return alert(file.name + " is not an image");
	            }
	            var reader = new FileReader();
	            reader.addEventListener("load", function() {
	                var image = new Image();
	                image.className += "image";
	                image.src = this.result;
	                preview.appendChild(image);
	            }, false);
	            reader.readAsDataURL(file);
	        }
	    };

	    document.querySelector('#file-input').addEventListener("change", renderFileList, false);

	    sendFile = function(file) {
	        var formData = new FormData();
	        var request = new XMLHttpRequest();
	        formData.set('receipt[image]', file);
	        request.onreadystatechange = function() {
	            if (this.readyState == 4 && this.status == 200) {
	                document.getElementById('uploadHolder').innerHTML = template2;
	            }
	        };
	        request.open("POST", 'http://interview.finly.io/receipts.json');
	        request.send(formData);
	    };
	}

	function delete_item(elementID) {
	    var url2 = "http://interview.finly.io/receipts/";
	    var request = new XMLHttpRequest();
	    request.open("DELETE", url2 + elementID, true);
	    request.addEventListener("error", alert('Unable to Delete file. API Error!'), false);
	    request.onload = function() {
	        var incomingdata = JSON.parse(request.responseText);
	        if (request.readyState == 4 && request.status == "200") {
	            console.table(incomingdata);
	        } else {
	            console.error(incomingdata);
	        }
	    }
	    request.send(null);
	}

	function modifyPUT(val) {
	    var myFile2 = document.getElementById('myFile2');
	    myFile2.click();
	    myFile2.onchange = function() {
	        if (myFile2.files.length == 0) {
	            alert("no files selected");
	        } else {
	            var idz = val.slice(6, 9);
	            var url = "http://interview.finly.io/receipts/" + idz;
	            var formData = new FormData();
	            var file = myFile2.files[0];
	            formData.append('receipt[image]', file);
	            var xhr = new XMLHttpRequest();
	            // Add any event handlers here...
	            xhr.open('PUT', url, true);
	            xhr.addEventListener("error", alert('Unable to Modify file. API Error!'), false);
	            xhr.onload = function() {
	                var users = JSON.parse(xhr.responseText);
	                if (xhr.readyState == 4 && xhr.status == "200") {
	                    console.log('done');
	                } else {
	                    console.error(users);
	                }
	            }
	            xhr.send(formData);
	        }
	    };
	}