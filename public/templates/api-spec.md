
# API Specification Template

## Overview

Brief description of the API and its purpose.

## Base URL

```
https://api.example.com/v1
```

## Authentication

How to authenticate with the API.

## Endpoints

### GET /resource

**Description:** Retrieve resources

**Parameters:**
- `limit` (optional): Number of items to return
- `offset` (optional): Number of items to skip

**Response:**
```json
{
  "data": [],
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

### POST /resource

**Description:** Create a new resource

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string", 
  "description": "string",
  "created_at": "timestamp"
}
```

## Error Handling

Standard HTTP status codes and error response format.

## Rate Limiting

Information about rate limits and how they're enforced.
