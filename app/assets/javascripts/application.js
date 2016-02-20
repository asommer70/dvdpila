// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require turbolinks
//= require websocket_rails/main
//= require_tree .

$(function(){
    $(document).foundation('tooltip', 'reflow');

    $(document).foundation({
        tooltip: {
            selector: '.has-tip',
            additional_inheritable_classes: [],
            tooltip_class: '.tooltip',
            touch_close_text: 'tap to close',
            disable_for_touch: false,
            hover_delay: 900,
            tip_template: function (selector, content) {
                return '<span data-selector="' + selector + '" class="'
                    + Foundation.libs.tooltip.settings.tooltip_class.substring(1)
                    + '">' + content + '<span class="nub"></span></span>';
            }
        }
    });

});

$(window).on('page:load', function() {
    $(document).foundation('tooltip', 'reflow');
});
