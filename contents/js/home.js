(function ($) {
  'use strict';

  $(function () {
    var $hero = $('.hero-unit');
    var $nav = $hero.find('hgroup ul');
    var $navEl = $nav.find('[data-tooltip]');
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
  });

}(window.jQuery));