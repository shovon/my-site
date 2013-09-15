# TODO: use bower instead of a shell script

extra_dependencies='contents/extra_dependencies'
cwd=`pwd`

bower install

normalize_css=$extra_dependencies/normalize/normalize.less
if [ ! -d `dirname $normalize_css` ]; then
  echo "Installing normalize.css"
  {
    mkdir -p `dirname $normalize_css`
    touch $normalize_css
    curl -L http://necolas.github.io/normalize.css/2.1.3/normalize.css > $normalize_css
  } || {
    echo "Failed to install Normalize.css"
    exit 1
  }
fi

monosocialicons=$extra_dependencies/monosocialicons
if [ ! -d $monosocialicons ]; then
  echo "Installing Mono Social Icons Font"
  {
    git clone https://github.com/drinchev/monosocialiconsfont.git $monosocialicons
    cd $monosocialicons
    git checkout e3ad9be016132f1e2711bf41370bf1fa63ba3833
    cd $cwd
  } || {
    echo "Failed to install Mono Social Icons Font"
    exit 1
  }
fi

tooltipster=$extra_dependencies/tooltipster
if [ ! -d $tooltipster ]; then
  echo "Installing Tooltipster"
  {
    tooltipster_js=$tooltipster/jquery.tooltipster.js
    tooltipster_css=$tooltipster/tooltipster.less

    mkdir -p $tooltipster

    touch $tooltipster_js
    touch $tooltipster_css

    curl https://raw.github.com/iamceege/tooltipster/2.1.4/js/jquery.tooltipster.js > $tooltipster_js
    curl https://raw.github.com/iamceege/tooltipster/2.1.4/css/tooltipster.css > $tooltipster_css
  } || {
    echo "Failed to install Tooltipster"
  }
fi