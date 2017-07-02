variable "aws_region" {
  description = ""
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = ""
}

variable "aws_allowed_account_ids" {
  description = ""
  type        = "list"
}

provider "aws" {
  profile             = "${var.aws_profile}"
  region              = "${var.aws_region}"
  allowed_account_ids = ["${var.aws_allowed_account_ids}"]
}

output "aws_region" {
  value = "${var.aws_region}"
}

output "aws_allowed_account_ids" {
  value = "${var.aws_allowed_account_ids}"
}
