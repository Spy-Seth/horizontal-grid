(function($) {
    $.fn.horizontalGrid = function(options) {
        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            container: $(window),
            columnsContainer: $('body'),
            eventNamespace : 'horizontalGrid'
        }, options);


        $.fn.scrollConverter().activate();

        /**
         * Met à jour la largeur du body la maintenir au plus proche de la dimension des colonnes.
         */
        var updateContainerWidth = function() {
            if ($('html').hasClass('mobileScreen') ||
                 $('html').hasClass('tabletScreen')) {
                $('body').css('width', '');
                console.info('updateContainerWidth() disable : mobile device detected.');
                return false;
            }

            // Calcul de la largeur totale des colonnes.
            var totalWidth = 0;
            $('.column').each(function() {
                totalWidth = totalWidth + $(this).outerWidth(true);
            });

            // Mise à jour de la largeur du conteneur.
            settings.columnsContainer.width(totalWidth);
        };

        /**
         *
         * @param container node
         * @param eventNamespace string
         */
        var registerUpdateContainerWidth = function(container, eventNamespace) {
            var events = 'load.%eventNamespace% ready.%eventNamespace% resize.%eventNamespace% columnUpdate.%eventNamespace%';
            events = events.replace('%eventNamespace%', eventNamespace);
            container.on(events, updateContainerWidth);
        };

        // On surveille les changements la largeur des colonnes
        registerUpdateContainerWidth(settings.container,  settings.eventNamespace);

       

        $(window).on('ready load resize.horizontalGrid', function() {
            var currentWidth = $(this).width();
            var htmlNode = $('html');

            /* All Mobile Sizes (devices and browser) */
            if (currentWidth <= 479) {
                htmlNode.toggleClass('mobileScreen', true);
                htmlNode.toggleClass('tabletScreen', false);
                htmlNode.toggleClass('smallScreen', false);
            }
            /* Tablet Portrait size to standard 960 (devices and browsers) */
            else if (currentWidth <= 767) {
                htmlNode.toggleClass('mobileScreen', false);
                htmlNode.toggleClass('tabletScreen', true);
                htmlNode.toggleClass('smallScreen', false);
            }
            /* Smaller than standard 960 (devices and browsers) */
            else if (currentWidth <= 959) {
                htmlNode.toggleClass('mobileScreen', false);
                htmlNode.toggleClass('tabletScreen', false);
                htmlNode.toggleClass('smallScreen', true);
            } else {
                htmlNode.toggleClass('mobileScreen', false);
                htmlNode.toggleClass('tabletScreen', false);
                htmlNode.toggleClass('smallScreen', false);
            }
        });
    

        return this;
    };
})(jQuery);