var app = {
    currentPageNumber: 1,
    currentScale: 1.0,
    currentPdf: undefined,
    currentPage: undefined,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        var xhr;

        if (device.platform === 'Android') {
            xhr = new XMLHttpRequest();
            xhr.open('GET', './kickstart.pdf', true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                var blob;

                if (this.status === 200) {
                    blob = new Blob([this.response], { type: 'application/pdf'});

                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
                        dir.getFile('kickstart.pdf', { create: true, exclusive: false }, function(file) {
                            file.createWriter(function(fileWriter) {
                                fileWriter.onwriteend = function() {
                                    console.log('Successful file write: ' + file.toURL());
                                };

                                fileWriter.onerror = function(e) {
                                    console.log('Failed file write: ' + e.toString());
                                };

                                fileWriter.write(blob);
                            });
                        });
                    });
                } else {
                    console.log('problem: ' + this.status);
                }
            } ;

            xhr.send();   
        } else {
            console.log('not android');
        }

        document.getElementById('pdfPrev').addEventListener(
            'click',
            function(e) {
                app.onPrevPage();
            }
        );

        document.getElementById('pdfNext').addEventListener(
            'click',
            function(e) {
                app.onNextPage();
            }
        );

        document.getElementById('pdfIn').addEventListener(
            'click',
            function(e) {
                app.onZoomIn();
            }
        );

        document.getElementById('pdfOut').addEventListener(
            'click',
            function(e) {
                app.onZoomOut();
            }
        );

        document.getElementById('iabOpen').addEventListener(
            'click',
            function(e) {
                app.onIAB();
            }
        );

        document.getElementById('fileOpen').addEventListener(
            'click',
            function(e) {
                app.onFileOpen();
            }
        );

        PDFJS.workerSrc = 'js/pdf.worker.js';

        PDFJS.getDocument('./kickstart.pdf').then(function getPdf(pdf) {
            app.currentPdf = pdf;
            app.openPage();
        });
    },

    openPage: function() {
        app.currentPdf.getPage(app.currentPageNumber).then(function getPdfPage(page) {
            var scale = app.currentScale;
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById('pdfCanvas');
            var context = canvas.getContext('2d');
            var renderContext;
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
            app.currentPage = page;
        });
    },

    onPrevPage: function() {
        if (app.currentPageNumber > 1) {
            app.currentPageNumber -= 1;
            app.currentScale = 1.0;
            app.openPage();
        }
    },

    onNextPage: function() {
        if (app.currentPageNumber <= app.currentPdf.numPages) {
            app.currentPageNumber += 1;
            app.currentScale = 1.0;
            app.openPage();
        }
    },

    onZoomIn: function() {
        var viewport = app.currentPage.getViewport(app.currentScale + 0.2);
        var canvas = document.getElementById('pdfCanvas');
        var context = canvas.getContext('2d');
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        app.currentScale += 0.2;
        app.currentPage.render(renderContext);
    },

    onZoomOut: function() {
        var viewport = app.currentPage.getViewport(app.currentScale - 0.2);
        var canvas = document.getElementById('pdfCanvas');
        var context = canvas.getContext('2d');
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        app.currentScale -= 0.2;
        app.currentPage.render(renderContext);    
    },

    onIAB: function() {
        window.open((device.platform === 'Android' ? cordova.file.externalDataDirectory + 'kickstart.pdf' : cordova.file.applicationDirectory + '/www/kickstart.pdf'), '_blank', 'location=no,enableViewportScale=yes');
    },

    onFileOpen: function() {       
        var filePathAndroid = cordova.file.externalDataDirectory + 'kickstart.pdf';
        cordova.plugins.fileOpener2.open(
            (device.platform === 'Android' ? cordova.file.externalDataDirectory + 'kickstart.pdf' : cordova.file.applicationDirectory + '/www/kickstart.pdf'),
            'application/pdf',
            {
                error: function(e) {
                    console.log('Error opening file:' + e);
                    console.log('path: ' + filePathAndroid);
                },
                success: function() {
                    console.log('File opened successfully');
                    console.log('path: ' + filePathAndroid);
                }
            }
        );
    }
};

app.initialize();
