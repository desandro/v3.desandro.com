build:
	@rm -rf _site # clear out previous site
	@grunt js
	@grunt scriptsrc
	@jekyll
	@cp .htaccess _site/

deploy: _site
	@echo 'Deploying to ${BERNA}'
	@rsync -avz _site/ $$BERNA:~/www
