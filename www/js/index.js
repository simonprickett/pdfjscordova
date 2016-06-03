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
            app.openPage();
        }
    },

    onNextPage: function() {
        if (app.currentPageNumber <= app.currentPdf.numPages) {
            app.currentPageNumber += 1;
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

        app.currentScale -= 0.2;
        app.currentPage.render(renderContext);    
    }
};

app.initialize();