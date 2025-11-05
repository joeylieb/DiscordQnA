## Files Excluded:
- config.json (inlcudes the people you want to answer)
- .env (important login credentials)

## config.json schema
```json
{
  "people": [
    {
      "name": "NameID of person",
      "namePretty": "Name of person but to look nice",
      "description": "Description of said person",
      "inboxID": "Channel ID of person it should go into",
      "timezone": "Timezone of person",
      "userID": "Discord UserID of person"
    }
  ],
  "answerChannel": "Channel ID of all answers to go into"
}
```
