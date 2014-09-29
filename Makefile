default: clean js/dist.js

js/dist.js: node_modules
	./node_modules/.bin/browserify js/src.js > js/dist.js

clean:
	@rm js/dist.js
