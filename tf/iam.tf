resource "aws_iam_user" "github" {
  name = "GithubSNSPublisher"
}

variable "pgp_key" {
  default = ""
}

resource "aws_iam_access_key" "github" {
  user    = "${aws_iam_user.github.name}"
  pgp_key = "${var.pgp_key}"
}

resource "aws_iam_user_policy" "github_publish_sns" {
  name = "github_publish_sns"
  user = "${aws_iam_user.github.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sns:Publish"
      ],
      "Resource": [
        "${aws_sns_topic.github_webhook.arn}"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

output "access_key" {
  value = "${aws_iam_access_key.github.id}"
}

output "secret_key" {
  value = "${aws_iam_access_key.github.encrypted_secret}"
}
