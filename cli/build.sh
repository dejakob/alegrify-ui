lessc index.less alegrify-ui.css --auto-rtl --autoprefix --global-var="theme=default"
lessc alegrify-ui.css alegrify-ui.min.css --clean-css

for THEME in "article" "dark"
do
  lessc index.less alegrify-ui--$THEME.css --auto-rtl --autoprefix --global-var="theme=$THEME"
  lessc alegrify-ui--$THEME.css alegrify-ui--$THEME.min.css --clean-css
done