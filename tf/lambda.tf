variable "github_token" {}

resource "aws_lambda_function" "github_webhook" {
  function_name    = "GithubWebHook"
  handler          = "index.handler"
  role             = "${aws_iam_role.lambda_role.arn}"
  runtime          = "nodejs6.10"

  filename = "../dist/build.zip"
  source_code_hash = "${base64sha256(file("../dist/build.zip"))}"

  environment {
    variables = {
      GITHUB_TOKEN = "${var.github_token}"
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "lambda_policy" {
  name = "PlanOneLambdaExecPolicy"
  roles = ["${aws_iam_role.lambda_role.id}"]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_permission" "sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.github_webhook.function_name}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.github_webhook.arn}"
}

resource "aws_sns_topic_subscription" "lambda" {
  topic_arn = "${aws_sns_topic.github_webhook.arn}"
  protocol  = "lambda"
  endpoint  = "${aws_lambda_function.github_webhook.arn}"
}
