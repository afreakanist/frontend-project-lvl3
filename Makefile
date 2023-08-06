develop:
	npx webpack serve

install:
	npm ci

build:
	NODE_ENV=production npx webpack

lint:
	npx eslint .

.PHONY: test