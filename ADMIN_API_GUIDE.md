# Admin API Reference - Complete Guide

## 🎯 Overview

Comprehensive admin APIs for complete platform management with **35+ endpoints** covering user management, content moderation, analytics, bulk operations, and more.

**Base URL**: `/admin`  
**Authentication**: Required (JWT Token)  
**Authorization**: ADMIN or SUPER_ADMIN role only

---

## 📊 Dashboard & System Health

### GET /admin/dashboard/stats

Get comprehensive dashboard overview with growth metrics.

**Response:**

```json
{
  "overview": {
    "totalUsers": 1250,
    "totalCourses": 150,
    "totalOrders": 3400,
    "totalRevenue": 125000.5,
    "activeEnrollments": 4500,
    "totalReviews": 890
  },
  "growth": {
    "users": {
      "thisMonth": 85,
      "lastMonth": 72,
      "growthRate": 18.06
    },
    "revenue": {
      "thisMonth": 15000.0,
      "lastMonth": 12000.0,
      "growthRate": 25.0
    }
  }
}
```

### GET /admin/system/health

Monitor system health and get alerts.

**Response:**

```json
{
  "database": {
    "status": "healthy",
    "collections": {
      "users": 1250,
      "courses": 150
    }
  },
  "platform": {
    "activeUsers": 1100,
    "publishedCourses": 145,
    "pendingReviews": 15,
    "failedOrders": 3
  },
  "alerts": ["High number of pending reviews"]
}
```

### GET /admin/platform/stats

Get 30-day platform statistics.

**Response:**

```json
{
  "users": { "total": 1250, "new30Days": 85 },
  "courses": { "total": 150, "new30Days": 12 },
  "orders": { "total": 3400, "new30Days": 245 },
  "revenue": { "total": 125000.5, "last30Days": 15000.0 },
  "enrollments": {
    "active": 4500,
    "completed": 3200,
    "completionRate": 71.11
  }
}
```

---

## 👥 User Management

### GET /admin/users

Get all users with advanced filters.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `role` (string): Filter by role (STUDENT, INSTRUCTOR, ADMIN, SUPER_ADMIN)
- `status` (string): Filter by status (active, suspended, banned, pending)
- `search` (string): Search by email, username, first/last name

**Example:** `GET /admin/users?role=STUDENT&status=active&search=john&page=1&limit=20`

### GET /admin/users/:id

Get detailed user information with activity history.

**Response:**

```json
{
  "user": { "id": "...", "email": "...", "role": "..." },
  "stats": {
    "enrolledCourses": 5,
    "completedCourses": 3,
    "totalOrders": 8,
    "totalSpent": 599.99,
    "totalReviews": 4
  },
  "recentActivity": {
    "enrollments": [...],
    "orders": [...],
    "reviews": [...]
  }
}
```

### PATCH /admin/users/:id/status

Update user account status.

**Body:**

```json
{
  "status": "active" | "suspended" | "banned"
}
```

### PATCH /admin/users/:id/role

Change user role.

**Body:**

```json
{
  "role": "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"
}
```

### DELETE /admin/users/:id

Permanently delete user (cascades to all related data).

---

## 📚 Course Management

### GET /admin/courses

Get all courses with filters.

**Query Parameters:**

- `page`, `limit`: Pagination
- `status`: draft, pending, published, rejected
- `category`: Course category
- `search`: Search in title/description

### POST /admin/courses/:id/approve

Approve a pending course for publication.

### POST /admin/courses/:id/reject

Reject a course submission.

**Body:**

```json
{
  "reason": "Does not meet quality standards. Please improve video quality and add more examples."
}
```

### DELETE /admin/courses/:id

Delete course (cascades to enrollments, quizzes, live sessions).

---

## 🛒 Order Management

### GET /admin/orders

Get all orders with filters.

**Query Parameters:**

- `status`: pending, processing, completed, failed, cancelled
- `paymentStatus`: Filter by payment status

### GET /admin/orders/:id

Get detailed order information with user details.

### PATCH /admin/orders/:id/status

Update order status manually.

**Body:**

```json
{
  "status": "completed" | "cancelled" | "refunded"
}
```

---

## ⭐ Review Moderation

### GET /admin/reviews/pending

Get all pending reviews awaiting moderation.

### POST /admin/reviews/:id/approve

Approve a review for public display.

### POST /admin/reviews/:id/reject

Reject inappropriate review.

### DELETE /admin/reviews/:id

Permanently delete a review.

---

## 📈 Analytics & Reports

### GET /admin/reports/revenue

Get revenue report for date range.

**Query:** `?startDate=2025-01-01&endDate=2025-01-31`

**Response:**

```json
{
  "period": {
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-31T23:59:59.999Z"
  },
  "summary": {
    "totalRevenue": 15000.0,
    "totalOrders": 245,
    "averageOrderValue": 61.22
  },
  "dailyRevenue": {
    "2025-01-01": 500.0,
    "2025-01-02": 750.0
  }
}
```

### GET /admin/analytics/top-courses

Get top performing courses.

**Query:** `?limit=10`

**Response:**

```json
[
  {
    "courseId": "...",
    "title": "Advanced React Development",
    "enrollments": 450,
    "completions": 320,
    "completionRate": 71.11
  }
]
```

### GET /admin/analytics/top-instructors

Get top instructors by student count.

**Response:**

```json
[
  {
    "instructorId": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "totalCourses": 12,
    "totalEnrollments": 2500
  }
]
```

### GET /admin/coupons/stats

Get usage statistics for all coupons.

---

## 🔄 Bulk Operations

### PATCH /admin/users/bulk/status

Update status for multiple users at once.

**Body:**

```json
{
  "userIds": ["id1", "id2", "id3"],
  "status": "suspended"
}
```

**Response:**

```json
{
  "modifiedCount": 3,
  "message": "3 users updated successfully"
}
```

### DELETE /admin/users/bulk

Delete multiple users (with cascade).

**Body:**

```json
{
  "userIds": ["id1", "id2", "id3"]
}
```

---

## 👨‍🏫 Instructor Management

### GET /admin/instructors/pending

Get pending instructor applications.

### POST /admin/instructors/:id/approve

Approve instructor application.

### POST /admin/instructors/:id/reject

Reject instructor application with reason.

**Body:**

```json
{
  "reason": "Insufficient teaching experience"
}
```

### GET /admin/instructors/:id/stats

Get comprehensive instructor performance stats.

**Response:**

```json
{
  "totalCourses": 12,
  "publishedCourses": 10,
  "totalEnrollments": 2500,
  "totalRevenue": 75000.00,
  "averageRating": 4.7,
  "courses": [...]
}
```

---

## 🚩 Content Moderation

### GET /admin/content/flagged

Get all flagged content for review.

**Query:** `?page=1&limit=20`

### POST /admin/content/:id/flag

Flag content as inappropriate.

**Body:**

```json
{
  "contentType": "review" | "course" | "comment",
  "reason": "Contains inappropriate language"
}
```

### DELETE /admin/content/:id/flag

Remove flag and mark content as appropriate.

**Body:**

```json
{
  "contentType": "review"
}
```

---

## 📊 Platform Activity

### GET /admin/platform/activity

Get recent platform activities.

**Query:** `?limit=50`

**Response:**

```json
[
  {
    "type": "user_registration",
    "description": "John Doe registered as STUDENT",
    "timestamp": "2025-01-15T10:30:00.000Z"
  },
  {
    "type": "course_created",
    "description": "New course 'React Basics' created",
    "timestamp": "2025-01-15T09:15:00.000Z"
  }
]
```

---

## 🔍 Search & Export

### GET /admin/search

Global search across users, courses, and orders.

**Query:** `?q=john&limit=10`

**Response:**

```json
{
  "users": [...],
  "courses": [...],
  "orders": [...]
}
```

### GET /admin/export/users

Export users to JSON format.

**Query:** `?role=STUDENT&status=active`

**Response:** Array of user objects ready for CSV conversion.

### GET /admin/export/orders

Export orders for accounting.

**Query:** `?startDate=2025-01-01&endDate=2025-01-31`

**Response:** Array of order objects with user details.

---

## 🔐 Authorization

All admin endpoints require:

1. **Valid JWT Token** in Authorization header:

   ```
   Authorization: Bearer <your-jwt-token>
   ```

2. **Admin Role**: User must have role `ADMIN` or `SUPER_ADMIN`

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions (not admin)
- `404 Not Found`: Resource not found
- `400 Bad Request`: Invalid request data

---

## 🎯 Use Cases

### Daily Admin Tasks

1. Check dashboard stats → `GET /admin/dashboard/stats`
2. Review pending content → `GET /admin/reviews/pending`
3. Monitor system health → `GET /admin/system/health`

### User Management

1. Search for user → `GET /admin/search?q=email`
2. View user details → `GET /admin/users/:id`
3. Update status → `PATCH /admin/users/:id/status`

### Course Management

1. Review pending courses → `GET /admin/courses?status=pending`
2. Approve course → `POST /admin/courses/:id/approve`
3. Track top courses → `GET /admin/analytics/top-courses`

### Financial Reports

1. Revenue report → `GET /admin/reports/revenue`
2. Export orders → `GET /admin/export/orders`
3. Top instructors → `GET /admin/analytics/top-instructors`

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination defaults: page=1, limit=20
- Bulk operations have a soft limit of 100 items
- Export endpoints return full datasets (no pagination)
- Cascade deletes are irreversible - use with caution
- Activity logs show last 50 activities by default

---

**Total Admin Endpoints: 35+**  
**Coverage: Complete platform management**
