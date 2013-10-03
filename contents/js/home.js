//import "../bower_components/jquery/jquery.js"
//import "../extra_dependencies/tooltipster/jquery.tooltipster.js"

(function ($) {
  'use strict';

  // TODO: make these DRY.
  var $bodySection = $('body > section')

  $bodySection.addClass('wait');

  $(function () {

    $('body > section hgroup h1').addClass('animated fadeInUp');
    $('body > section hgroup ul').addClass('animated fadeInUp04');
    $('body > section hgroup p').addClass('animated fadeInUp');

    setTimeout(function () {
      $('body > section').removeClass('wait');
      $('body > section hgroup h1').removeClass('animated fadeInUp');
      $('body > section hgroup ul').removeClass('animated fadeInUp04');
      $('body > section hgroup p').removeClass('animated fadeInUp');
    }, 2000);

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

//import "layout.js"