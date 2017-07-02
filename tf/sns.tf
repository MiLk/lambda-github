resource "aws_sns_topic" "github_webhook" {
  name = "github-webhook-topic"
}

output "sns_topic_arn" {
  value = "${aws_sns_topic.github_webhook.arn}"
}
