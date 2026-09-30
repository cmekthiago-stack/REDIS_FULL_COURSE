Use postman to test APIs workability in terms of routing and authenticating with jwt and general flow of the project
For controllers, use the following http request to navigate about the subscriber and notification: curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Order Created",
    "message": "A new order has been created successfully"
  }'
  
