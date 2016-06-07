var app = {
    currentPageNumber: 1,
    currentScale: 1.0,
    currentPdf: undefined,
    currentPage: undefined,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
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
        window.open(cordova.file.applicationDirectory + '/www/kickstart.pdf', '_blank', 'location=no');
    },

    onFileOpen: function() {
        cordova.plugins.fileOpener2.open(
            cordova.file.applicationDirectory + '/www/kickstart.pdf',
            'application/pdf',
            {
                error: function() {

                },
                success: function() {

                }
            }
        );
    }
};

app.initialize();
