build:
	@make scripts_all
	@jekyll

script_files =\
modules/requestanimationframe/requestanimationframe.js\
js/base.js\
js/sparkleshine.js\
js/charparticle.js\
js/typekit.js\
js/init.js

hintables = \
js/base.js\
js/charparticle.js\
js/sparkleshine.js\
js/typekit.js\
js/init.js

jshint: $(hintables)
	@echo running jsHint on scripts
	@for hintable in $(hintables); do \
		jshint $$hintable; \
	done

# timestamp=$(shell date +%y%m%d%H%M%S)

scripts_all_regex = js/scripts-all*.js
scripts_all_js = js/scripts-all.$(shell date +%y%m%d%H%M%S).js

getnow:
	@echo $(rightnow)

date:
	echo $$(date +%y%m%d%H%M%S)

# updates <script>
# should be private function, but I don't know how to do that :P
update_scripts_all: js/scripts-all.*.js index.html
	@echo 'updating index.html with <script src="$<">'
	@sed -i '' "s/js\/scripts-all.*[0-9]*.js/$(subst /,\/,$<)/g" index.html



# remove any lines that begin with /*jshint or /*global
# then, minify with Uglify JS
# then, add newline characters after `*/`, but not last newline character
scripts_all:
	@echo 'Concatenating JS...'
	@rm -f js/scripts-all*.js # remove previous scripts-all file
	@for script in $(script_files); do \
		echo "\n// ----- $$script ----- //\n" >> $(scripts_all_js); \
		if [[ $$script != *min.js* ]]; then \
			echo "...minifying and adding $$script"; \
			awk '!/^\/\*[jshint|global]/' $$script \
				| uglifyjs \
				| awk '{ORS=""; gsub(/\*\//,"*/\n"); if (NR!=1) print "\n"; print;}' >> $(scripts_all_js); \
			echo "\n" >> $(scripts_all_js); \
		else \
			echo "...adding $$script"; \
			cat $$script >> $(scripts_all_js); \
		fi; \
	done
	@make update_scripts_all


# concatenate the file
scripts_all_full:
	@echo 'Concatenating JS...'
	@rm -f js/scripts-all*.js # remove previous scripts-all file
	@for script in $(script_files); do \
		echo "  adding $$script"; \
		echo "\n// ----- $$script ----- //\n" >> $(scripts_all_js); \
		cat $$script >> $(scripts_all_js); \
	done
	@make update_scripts_all