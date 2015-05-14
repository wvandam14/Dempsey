// Code by http://joelhooks.com - dropdown service
soccerStats.service('dropdownService', function($document) {
    var self = this, openScope = null;

    this.open = function( dropdownScope ) {
        if ( !openScope ) {
            $document.bind('click', closeDropdown);
            $document.bind('keydown', escapeKeyBind);
        }

        if ( openScope && openScope !== dropdownScope ) {
            openScope.isOpen = false;
        }

        openScope = dropdownScope;
    };

    this.close = function( dropdownScope ) {
        if ( openScope === dropdownScope ) {
            openScope = null;
            $document.unbind('click', closeDropdown);
            $document.unbind('keydown', escapeKeyBind);
        }
    };

    var closeDropdown = function() {
        openScope.$apply(function() {
            openScope.isOpen = false;
        });
    };

    var escapeKeyBind = function( evt ) {
        if ( evt.which === 27 ) {
            closeDropdown();
        }
    };
})