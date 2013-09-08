extra_dependencies='contents/extra_dependencies'

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
  } || {
    echo "Failed to install Mono Social Icons Font"
  }
fi