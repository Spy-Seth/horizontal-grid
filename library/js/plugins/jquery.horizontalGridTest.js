(function($) {
    $.fn.horizontalGridTest = function(options) {
        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
        }, options);

        /**
         *
         */
        var getColumnSizeFormClasses = function(classes) {
            var columnSize = null;
            $(classes.split(' ')).each(function() {
                if (-1 !== this.indexOf('size-')) {
                    columnSize = this.replace('size-', '');
                    return false;
                }
            });

            return columnSize;
        };

        $('.column').each(function() {
            var control = $('\
                <div class="control">\n\
                    <a href="#" data-size-increment="-25"><--</a>\n\
                    <a href="#" data-size-increment="-10"><-</a>\n\
                    <a href="#" data-size-increment="-5"><</a>\n\
                    <a href="#" data-size-increment="5">></a>\n\
                    <a href="#" data-size-increment="10">-></a>\n\
                    <a href="#" data-size-increment="25">--></a>\n\
                </div>\n\
            ');

            control.find('a').on('click', function() {
                // Récupération de la largeur courrante de la colonne.
                var currentColumn = $(this).parents('.column');
                var currentColumnClassSize = 0;
                var currentColumnSize = 0;
                $(currentColumn.attr('class').split(' ')).each(function() {
                    if (-1 !== this.indexOf('size-')) {
                        currentColumnClassSize = this.toString();
                        currentColumnSize = this.replace('size-', '');
                        return false;
                    }
                });

                // Calcul de la nouvelle largeur.
                var newColumnSize = parseInt(currentColumnSize) + parseInt($(this).data('sizeIncrement'));

                if (newColumnSize <= 1) {
                    newColumnSize = 1;
                } else if (newColumnSize > 100) {
                    newColumnSize = 100;
                }

                // Si la colonne courante est une colonne qui viens par dessus 
                // ça précédente, il ne faut pas qu'elle puisse devenir plus
                // grande que celle-ci.
                if (currentColumn.hasClass('hoverPrevious')) {
                    var previousColumn = currentColumn.prev();
                    
                    if (previousColumn.length > 0) {
                        var previousColumnSize = getColumnSizeFormClasses(previousColumn.attr('class'))
                        console.log(previousColumnSize, newColumnSize);

                        // petit hack en attendant d'avoir définie les classes css pour .column.hoverPrevious.size-2/3/4/..
                        if (newColumnSize != 1
                                && (newColumnSize % 5) != 0) {
                            newColumnSize = newColumnSize - 1;
                        }

                        // Si la nouvelle taille de la colonne est plus grande que
                        // la taille de la colonne que chevauche la colonne courante
                        // on empêche cette taille
                        if (newColumnSize > previousColumnSize) {
                            newColumnSize = previousColumnSize;
                        }
                    }
                }

                var newColumnClassSize = 'size-' + newColumnSize;

                // Animation du changement de taille de la colonne.
                if (currentColumnClassSize != newColumnClassSize) {
                    currentColumn.switchClass(currentColumnClassSize, newColumnClassSize, 500, "easeInOutQuad", function() {
                        $(window).trigger('columnUpdate');
                    });
                }
                $(window).trigger('columnUpdate');

                return false;
            });

            control.prependTo($(this));
        });

        return this;
    };
})(jQuery);