.PHONY: gen-env

# Переменные окружения по-умолчанию
API_URL ?= http://84.252.134.106:8000/api

gen-env:
	@echo "NEXT_PUBLIC_API_BASE_URL=$(API_URL)" > frontend/.env
	@echo ".env file generated with:"
	@cat frontend/.env

clean-env:
	@rm -f frontend/.env
	@echo ".env removed"
