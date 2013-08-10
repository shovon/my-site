(function ($) {
  "use strict";

  var
  none = { background: "white", foreground: "black" },
  services = {
    "Twitter"   : { background: "#0096ff", foreground: "white" },
    "GitHub"    : { background: "#242424", foreground: "white" },
    "LinkedIn"  : { background: "#367da6", foreground: "white" },
    "Google+"   : { background: "#00bc66", foreground: "white" },
    "YouTube"   : { background: "#942424", foreground: "white" },
    "SoundCloud": { background: "#ff6600", foreground: "white" },
    "Email"     : { background: "#778b93", foreground: "white" }
  },
  introNav = $(".intro nav"),
  cursor = $(".intro div"),
  setTheme = function (theme) {
    $("html").css({
      "background-color": theme.background,
      "color": theme.foreground
    });
    $(".intro li a, .intro div").attr("class", "").addClass(theme.foreground);
  },
  moveCursor = function (position, width) {
    cursor.css({
      "opacity": "0.5",
      "left": position.left + "px",
      "width": width + "px"
    });
  };

  $(function () {
    introNav.mouseleave(function () {
      cursor.css("opacity", "0");
      setTheme(none);
    });

    $(".intro li").mouseenter(function () {
      var
      $this       = $(this),
      serviceName = $this.children().html(),
      serviceStyle = services[serviceName];
      
      setTheme(serviceStyle);
      moveCursor($this.position(), $this.width());
    });

    $("[data-tooltip]").tooltipster({
      delay: 0,
      theme: ".simple-black"
    });
  });
})(window.jQuery);
