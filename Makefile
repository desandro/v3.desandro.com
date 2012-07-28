build:
	jekyll

script_files =\
modules/requestanimationframe/requestanimationframe.js\
js/base.js\
js/sparkleshine.js\
js/charparticle.js\
js/typekit.js\
js/init.js

scripts:
	@for script in $(script_files); do \
		echo $$script; \
	done

hintables = \
js/base.js\
js/charparticle.js\
js/sparkleshine.js\
js/typekit.js\
js/init.js

jshint: js
	@echo running jsHint on scripts
	@for hintable in $(hintables); do \
		jshint $$hintable; \
	done

date:
	echo $$(date +%y%m%d%H%M%S)

scripts-all-full:
	@echo 'Concatenating JS...'
	@rm -f js/scripts-all*.js # remove previous scripts-all file
	@for script in $(script_files); do \
		echo "  Adding $$script"; \
		echo "\n// ----- $$script ----- //\n" >> tmp.js; \
		cat $$script >> tmp.js; \
	done
	@mv tmp.js js/scripts-all.$$(date +%y%m%d%H%M%S).js


hello:
	@make sup
	@echo 'hello world'

sup:
	@echo 'yo, sup'