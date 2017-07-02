# Lambda GitHub

## Requirements

* Terraform
* An AWS account
* Github Token with access to your repos

## Setup

### Create the configuration file

Create a `tf/variables.tfvars` file with:
```
aws_profile = "AWS_PROFILE_NAME"
aws_allowed_account_ids = ["AWS_ACCOUNT_ID"]
pgp_key = "keybase:KEYBASE_USERNAME"
github_token = "GITHUB_TOKEN"
```

### Provision the infrastructure

```bash
make build apply
```

### Configure the GitHub integration

1. Navigate to your GitHub repo.
2. Click on “Settings” in the sidebar.
3. Click on “Webhooks & Services”.
4. Click the “Add service” dropdown, then click “AmazonSNS”.
5. Fill out the form with the output of `make github`.
