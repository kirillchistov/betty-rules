.DEFAULT_GOAL := help

.PHONY: help install dev build preview clean

help:
	@echo "make install   поставить зависимости"
	@echo "make dev       локальный сервер, в том числе по сети"
	@echo "make build     проверка типов и сборка в dist/"
	@echo "make preview   собрать и открыть dist/"
	@echo "make clean     удалить dist/"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

clean:
	rm -rf dist
