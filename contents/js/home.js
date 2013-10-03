//import "../bower_components/jquery/jquery.js"
//import "../extra_dependencies/tooltipster/jquery.tooltipster.js"

(function ($) {
  'use strict';

  // TODO: make these DRY.

  $(function () {
    
    var bodySection = { $el: $('body > section') };
    var bodyHeader = { $el: $('body > header') };

    bodySection.hgroup = {
      $el: $('body > section hgroup'),
      h1: { $el: $('body > section hgroup h1') },
      ul: {
        $el: $('body > section hgroup ul'),
        li: {
          $el: $('body > section hgroup ul li[data-tooltip]')
        }
      },
      p: { $el: $('body > section hgroup p') }
    };

    bodySection.hgroup.h1.$el.addClass('animated fadeInUp');
    bodySection.hgroup.ul.$el.addClass('animated fadeInUp');
    bodySection.hgroup.p.$el.addClass('animated fadeInUp');

    bodySection.hgroup.ul.$el.mouseleave(function () {
      bodySection.$el.css({'background-color': ''}).removeClass('white');
    });
    bodySection.hgroup.ul.li.$el.mouseenter(function () {
      var color = $(this).attr('data-background');
      bodySection.$el.css({'background-color': color}).addClass('white');
    });
    bodySection.hgroup.ul.li.$el.tooltipster({
      delay: 0,
      theme: '.tooltip-simple-black'
    });

    var $window = $(window);
    $window.resize(function () {
      resizeHero();
    });

    resizeHero();

    function resizeHero() {
      var headerHeight = bodyHeader.$el.height();
      var windowHeight = $window.height();
      var introHeight = bodySection.hgroup.$el.height();

      var newHeroHeight = windowHeight - headerHeight;
      if (newHeroHeight < introHeight + 50) {
        newHeroHeight = introHeight + 50;
      }

      var newIntroPadding = (newHeroHeight / 2) - (introHeight / 2) - 25;

      bodySection.$el.height(newHeroHeight);
      bodySection.hgroup.$el.css('padding-top', (newIntroPadding) + 'px');
    }
  });

}(window.jQuery));

//import "layout.js"