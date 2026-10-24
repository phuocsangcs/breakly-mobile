REPORT := report.tex
BUILD_DIR := build

.PHONY: all build clean view

all: build

build:
	latexmk -xelatex -synctex=1 -interaction=nonstopmode -file-line-error -outdir=$(BUILD_DIR) $(REPORT)
	cp $(BUILD_DIR)/report.pdf report.pdf
	cp $(BUILD_DIR)/report.synctex.gz report.synctex.gz

view: build
	open $(BUILD_DIR)/report.pdf

clean:
	latexmk -C -outdir=$(BUILD_DIR) $(REPORT)
	rm -rf $(BUILD_DIR)
