resource "aws_dynamodb_table" "snack-table" {
    hash_key       = "name"
    billing_mode   = "PROVISIONED"
    name           = "snacks"
    read_capacity  = 1
    stream_enabled = false
    write_capacity = 1

    attribute {
        name = "name"
        type = "S"
    }

    point_in_time_recovery {
        enabled = false
    }

    timeouts {}

}

resource "aws_cloudwatch_event_rule" "slack-bot-schedule" {
    description         = "everyday 15:00"
    event_bus_name      = "default"
    is_enabled          = true
    name                = "everyday15"
    schedule_expression = "cron(0 6 ? * MON-FRI *)"
}

data "aws_iam_role" "slack-bot-random-snack-role" {
    name = var.slackbot_lambda_role
}

data "archive_file" "slack-bot-function-source" {
    type        = "zip"
    output_path = "${path.module}/lambda/post-slack-random-snack/index.mjs.zip"
    source_file = "${path.module}/lambda/post-slack-random-snack/index.mjs"
}

resource "aws_lambda_function" "slack-bot-random-snack" {
    architectures                  = [
        "x86_64",
    ]
    function_name                  = "post-slack-random-snack"
    filename                       = data.archive_file.slack-bot-function-source.output_path
    handler                        = "index.handler"
    layers                         = [
        "arn:aws:lambda:ap-northeast-1:906124551921:layer:nodejs:1",
    ]
    memory_size                    = 128
    package_type                   = "Zip"
    reserved_concurrent_executions = -1
    role                           = data.aws_iam_role.slack-bot-random-snack-role.arn
    runtime                        = "nodejs18.x"
    timeout                        = 3

    environment {
        variables = {
            WEBHOOK_URL = var.slack_webhook_url
        }
    }

    ephemeral_storage {
        size = 512
    }

    tracing_config {
        mode = "PassThrough"
    }
}
