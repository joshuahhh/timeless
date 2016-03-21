parallel --line-buffer <<EOM
# ls contents.html wrapper.html | entr bash -c "sed -f replace.sed wrapper.html > index.html; echo 'compiled'"
ls contents.html wrapper.html | entr bash -c "typeset-js contents.html contents-typeset.html --disable ligatures; echo 'compiled'"
python -mSimpleHTTPServer
EOM
