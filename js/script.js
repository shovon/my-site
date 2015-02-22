;(function () {
  var $html = $('html');

  $('.social').mouseleave(function () {
    $html.css('background-color', 'transparent');
    $html.removeClass('hovering');
  });

  $('.social a').mouseover(function () {
    var color = $(this)
      .find('span')
      .attr('style')
      .split(',')
      .filter(function (attribute) {
        return attribute.split(':')[0].trim() === 'background-color';
      })[0] || 'background-color: black';
    color = color.split(':')[1] || 'black'; color = color.trim();
    if (color[color.length - 1] === ';') {
      color = color.slice(0, color.length - 1);
      color = color.trim();
    }
    $html.css('background-color', color);
    $html.addClass('hovering');
  });
})();