var downloadFile = window['downloadFile']=function downloadFile(fileName, csvContent) {
  var D = document;
  var a =  E.A();
  var strMimeType = 'application/octet-stream;charset=utf-8';
  var rawFile;

  if (!fileName) {
    var currentDate = new Date();
    fileName = "CWS Export - " + currentDate.getFullYear() + (currentDate.getMonth() + 1) +
                  currentDate.getDate() + currentDate.getHours() +
                  currentDate.getMinutes() + currentDate.getSeconds() + ".csv";
  }

  var Sniffr = window['Sniffr'];
  var isIE  = Sniffr['browser']['name']=='ie';
  var version = Sniffr['browser']['version'][0];
  if (isIE&&version< 10) {
	  console.log('was ie');
    var frame = D.createElement('iframe');
    document.body.appendChild(frame);

    frame.contentWindow.document.open("text/html", "replace");
    frame.contentWindow.document.write('sep=,\r\n' + csvContent);
    frame.contentWindow.document.close();
    frame.contentWindow.focus();
    frame.contentWindow.document.execCommand('SaveAs', true, fileName);

    document.body.removeChild(frame);
    return true;
  }

  // IE10+
  if (isIE&&navigator.msSaveBlob) {
	  console.log('was ie10');
    return navigator.msSaveBlob(new Blob(["\ufeff", csvContent], {
      'type': strMimeType
    }), fileName);
  }

  //html5 A[download]
  if ('download' in a) {
	  console.log('a download');
    var blob = new Blob([csvContent], {
      'type': strMimeType
    });
    rawFile = URL.createObjectURL(blob);
    a.setAttribute('download', fileName);
  } else {
    rawFile = 'data:' + strMimeType + ',' + encodeURIComponent(csvContent);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', fileName);
  }


  a.href = rawFile;
  a.setAttribute('style', 'display:none;');
  D.body.appendChild(a);
  setTimeout(function() {
    if (a.click) {
      a.click();
      // Workaround for Safari 5
    } else if (document.createEvent) {
      var eventObj = document.createEvent('MouseEvents');
      eventObj.initEvent('click', true, true);
      a.dispatchEvent(eventObj);
    }
    D.body.removeChild(a);

  }, 100);
};