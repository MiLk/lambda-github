plan:
	@cd tf && terraform plan -var-file=variables.tfvars

apply:
	@cd tf && terraform apply -var-file=variables.tfvars

github:
	@cd tf && \
		echo "Aws key:" && \
		terraform output access_key && \
		echo "Sns topic:" && \
		terraform output sns_topic_arn && \
		echo "Sns region:" && \
		terraform output aws_region && \
		echo "Aws secret:" && \
		terraform output secret_key | base64 --decode | gpg2 --decrypt && \
		echo

build:
	@mkdir -p dist && \
		npm install --production && \
		npm prune --production && \
		zip -r dist/build.zip *.js node_modules
