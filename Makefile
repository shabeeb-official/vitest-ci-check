BUILD_DIR := build
LOADER_FILE := loader.js
CORS_FILE := cors-config.json
ARCHIVE := archive.tar.gz
NPM := npm run 


.PHONY: all lint dev build clean update-loader pull-docs

all: build

lint:
	$(NPM) lint

dev:
	$(NPM) dev

clean:
	rm -rf $(BUILD_DIR) $(ARCHIVE)

build: clean 
	$(NPM) build
	cp $(LOADER_FILE) $(BUILD_DIR)
	cp $(CORS_FILE) $(BUILD_DIR)
	tar -czvf $(ARCHIVE) $(BUILD_DIR)

build-stage: clean 
	$(NPM) build:staging
	cp $(LOADER_FILE) $(BUILD_DIR)
	cp $(CORS_FILE) $(BUILD_DIR)
	tar -czvf $(ARCHIVE) $(BUILD_DIR)

serve: build
	serve -s build --cors -l 3000

pull-docs:
	rsync -av --delete ~/Notes/bayezon/citybeach/** ./docs

update-loader:
	sudo rm /var/www/au/sunny/loader.js
	sudo cp ./loader.js /var/www/au/sunny
