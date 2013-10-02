(function ($) {
  'use strict';

  $(function () {
    var $hero = $('body > section');
    var $headerNav = $('body > header');
    var $intro = $hero.find('hgroup');
    var $nav = $intro.find('ul');
    var $navEl = $nav.find('[data-tooltip]');
    var $window = $(window);

    $nav.mouseleave(function () {
      $hero.css({'background-color': ''}).removeClass('white');
    });
    $navEl.mouseenter(function () {
      var color = $(this).attr('data-background');
      $hero.css({'background-color': color}).addClass('white');
    });
    $navEl.tooltipster({
      delay: 0,
      theme: '.tooltip-simple-black'
    });

    $window.resize(function () {
      resizeHero();
    });

    resizeHero();

    function resizeHero() {
      var headerHeight = $headerNav.height();
      var windowHeight = $window.height();

      var introHeight = $intro.height();

      var newHeroHeight = windowHeight - headerHeight;

      if (newHeroHeight < introHeight + 50) {
        newHeroHeight = introHeight + 50;
      }

      var newIntroPadding = (newHeroHeight / 2) - (introHeight / 2);

      $hero.height(newHeroHeight);

      $intro.css('padding-top', (newIntroPadding) + 'px');
    }
  });

}(window.jQuery));