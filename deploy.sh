#!/bin/bash
# Define variables
SERVICE=$1
IMAGE=$2
FIFTH_DEPLOYMENT_PASSWORD=$3
# Prepare JSON payload for deployment
JSON_PAYLOAD=$(printf '{"image": "%s", "serviceName": "%s"}' "$IMAGE" "$SERVICE")
# Output the JSON payload
echo "JSON Payload: $JSON_PAYLOAD"
# Send deployment request
echo "Sending deployment request..."
HTTP_STATUS=$(curl -k -u expia_deploy:"$FIFTH_DEPLOYMENT_PASSWORD" -o response.txt -w "%{http_code}" -X POST https://expia-deploy.fifth-llc.com/deploy.php -H "Content-Type: application/json" -d "$JSON_PAYLOAD")
RESPONSE=$(cat response.txt)
# Check if the HTTP status code is 200
if [ "$HTTP_STATUS" -ne 200 ]; then
  echo "Deployment failed with status code $HTTP_STATUS. Message  is $RESPONSE"
  exit 1
else
  echo "Deployment succeeded with response $RESPONSE"
fi
