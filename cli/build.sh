# Full builds
## Default theme
lessc index.less alegrify-ui.css --auto-rtl --autoprefix --global-var="theme=default"
lessc alegrify-ui.css alegrify-ui.min.css --clean-css

## Other themes
for THEME in "article" "dark"
do
  lessc index.less alegrify-ui--$THEME.css --auto-rtl --autoprefix --global-var="theme=$THEME"
  lessc alegrify-ui--$THEME.css alegrify-ui--$THEME.min.css --clean-css
done

# Component builds
rm -rf ./tmp
mkdir ./tmp

for f in ./lib/* ;
do
  # take action on each file. $f store current file name
  if [[ $f != \./lib/_* ]] && [[ $f != ./lib/themes ]] ;
  then
    echo "@import '../lib/_index.less';\n\n$(cat $f)" > "./tmp/$(basename $f)"

    for THEME in "article" "dark"
    do
      lessc "./tmp/$(basename $f)" "./components/$THEME/$(echo $(basename $f) | sed 's/\.[^.]*$//').css" --auto-rtl --autoprefix --global-var="theme=$THEME"
      lessc "./components/$THEME/$(echo $(basename $f) | sed 's/\.[^.]*$//').css" "./components/$THEME/$(echo $(basename $f) | sed 's/\.[^.]*$//').min.css" --clean-css
    done
  fi
done

rm -rf ./tmp