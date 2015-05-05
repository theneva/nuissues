# NUIssues

Natural User Interface for touch-based simple issue tracking.

## JSON API routes

`GET /api/issues`: Get all available issues
`POST /api/issues`: Create a new issue
`PUT /api/issues/:id`: Update an existing issue (send an object containing all fields to update)
`DELETE /api/issues/:id`: Permanently delete an existing issue (also removes the time logged for that issue)

## Models

### Issue

`_id`: A unique identifier for the issue
`title`: A short, descriptive title for groking the issue at a glance
`description`: An extended description of the issue
`status`: one of `todo`, `doing`, `done`, or `archived`, used to include and position the issue in the interface
`minutesLogged`: The amount of work logged on solving the issue, specified in minutes.
`created`: An ISO date string representing when the issue was created
