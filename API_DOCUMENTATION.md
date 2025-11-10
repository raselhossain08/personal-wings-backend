# Learning Management System (LMS) - Complete API Documentation

## 📚 Overview

This is a comprehensive Learning Management System with video courses, live sessions, quizzes, gamification, and e-commerce features.

## 🔐 Authentication & Users

### Auth Module (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get current user profile
- `POST /auth/refresh-token` - Refresh JWT token
- `GET /auth/admin/stats` - Admin dashboard statistics

### Users Module (`/users`)

- `POST /users` - Create new user (Admin)
- `GET /users` - Get all users with pagination
- `GET /users/instructors` - Get all instructors
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/change-password` - Change password

## 📖 Course Management

### Courses Module (`/courses`)

- `POST /courses` - Create new course (Instructor)
- `GET /courses` - Get all courses with filters
- `GET /courses/featured` - Get featured courses
- `GET /courses/instructor/my-courses` - Get instructor's courses
- `GET /courses/stats` - Get course statistics
- `GET /courses/:id` - Get course by ID
- `PATCH /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `POST /courses/:id/lessons` - Add lesson to course
- `PUT /courses/:id/lessons/:lessonId` - Update lesson
- `DELETE /courses/:id/lessons/:lessonId` - Delete lesson

### Enrollments Module (`/enrollments`)

- `POST /enrollments` - Enroll in a course
- `GET /enrollments/my-enrollments` - Get user enrollments
- `GET /enrollments/my-stats` - Get enrollment statistics
- `GET /enrollments/course/:courseId` - Get enrollment for course
- `GET /enrollments/course/:courseId/check` - Check enrollment status
- `PATCH /enrollments/course/:courseId/progress` - Update progress
- `DELETE /enrollments/course/:courseId` - Unenroll from course
- `GET /enrollments/course/:courseId/students` - Get enrolled students (Instructor)
- `GET /enrollments/course/:courseId/stats` - Get enrollment stats

## 🎯 Assessments

### Quizzes Module (`/quizzes`)

- `POST /quizzes` - Create quiz (Instructor)
- `GET /quizzes` - Get all quizzes
- `GET /quizzes/my-submissions` - Get user quiz submissions
- `GET /quizzes/:id` - Get quiz by ID
- `PATCH /quizzes/:id` - Update quiz
- `DELETE /quizzes/:id` - Delete quiz
- `POST /quizzes/:id/start` - Start quiz attempt
- `POST /quizzes/:id/submit/:submissionId` - Submit quiz answers
- `GET /quizzes/submissions/:submissionId` - Get submission details
- `GET /quizzes/:id/submissions` - Get all submissions (Instructor)
- `GET /quizzes/:id/stats` - Get quiz statistics

## 📹 Live Sessions

### Live Sessions Module (`/live-sessions`)

- `POST /live-sessions` - Create live session (Instructor)
- `GET /live-sessions` - Get all live sessions
- `GET /live-sessions/my-sessions` - Get instructor sessions
- `GET /live-sessions/upcoming` - Get upcoming sessions
- `GET /live-sessions/:id` - Get session by ID
- `PATCH /live-sessions/:id` - Update session
- `DELETE /live-sessions/:id` - Cancel session
- `POST /live-sessions/:id/join` - Join session
- `POST /live-sessions/:id/leave` - Leave session
- `POST /live-sessions/:id/start` - Start session (Instructor)
- `POST /live-sessions/:id/end` - End session (Instructor)
- `GET /live-sessions/:id/stats` - Get session statistics
- `GET /live-sessions/course/:courseId` - Get course sessions

## ⭐ Reviews & Ratings

### Reviews Module (`/reviews`)

- `POST /reviews` - Create review
- `GET /reviews` - Get all reviews with filters
- `GET /reviews/my-reviews` - Get user reviews
- `GET /reviews/:id` - Get review by ID
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `POST /reviews/:id/helpful` - Mark review as helpful
- `POST /reviews/:id/reply` - Reply to review (Instructor)
- `GET /reviews/stats/:itemId` - Get review statistics

## 🎮 Gamification

### Gamification Module (`/gamification`)

- `GET /gamification/my-points` - Get user points and achievements
- `GET /gamification/leaderboard` - Get leaderboard

**Point System:**

- Course Completed: 100 points
- Lesson Completed: 10 points
- Quiz Passed: 25 points
- Assignment Submitted: 20 points
- Perfect Score: 50 points
- Daily Login: 5 points
- Course Reviewed: 15 points
- Discussion Post: 5 points
- Help Others: 10 points
- Streak Milestone: 30 points

## 🛒 E-Commerce

### Products Module (`/products`)

- `POST /products` - Create product
- `GET /products` - Get all products with filters
- `GET /products/featured` - Get featured products
- `GET /products/search` - Search products
- `GET /products/seller/my-products` - Get seller products
- `GET /products/:id` - Get product by ID
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders Module (`/orders`)

- `POST /orders` - Create order
- `GET /orders` - Get all orders (Admin)
- `GET /orders/my-orders` - Get user orders
- `GET /orders/stats` - Get order statistics
- `GET /orders/:id` - Get order by ID
- `GET /orders/number/:orderNumber` - Get order by number
- `PATCH /orders/:id` - Update order status
- `DELETE /orders/:id` - Cancel order

### Payments Module (`/payments`)

- `POST /payments/create-intent` - Create payment intent
- `POST /payments/process` - Process payment
- `POST /payments/webhook/stripe` - Stripe webhook
- `POST /payments/webhook/paypal` - PayPal webhook
- `GET /payments/invoices` - Get user invoices
- `GET /payments/invoices/:id` - Get invoice by ID

### Wishlist & Cart (`/wishlist`, `/cart`)

- `GET /wishlist` - Get user wishlist
- `POST /wishlist/:courseId` - Add to wishlist
- `DELETE /wishlist/:courseId` - Remove from wishlist
- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `DELETE /cart/:itemId` - Remove from cart
- `DELETE /cart` - Clear cart

### Coupons Module (`/coupons`)

- `POST /coupons` - Create coupon (Admin)
- `POST /coupons/validate` - Validate coupon code
- `GET /coupons` - Get all coupons (Admin)

## 💬 Communication

### Chat Module (`/chat`)

- `POST /chat/conversations` - Create conversation
- `GET /chat/conversations` - Get user conversations
- `GET /chat/conversations/:id` - Get conversation details
- `GET /chat/conversations/:id/messages` - Get messages
- `POST /chat/conversations/:id/messages` - Send message
- `PATCH /chat/messages/:id/read` - Mark message as read
- `DELETE /chat/conversations/:id` - Delete conversation
- `GET /chat/unread-count` - Get unread messages count

### Notifications Module (`/notifications`)

- `GET /notifications` - Get user notifications
- `GET /notifications/unread` - Get unread notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

## 📊 Analytics

### Analytics Module (`/analytics`)

- `GET /analytics/dashboard` - Get dashboard analytics
- `GET /analytics/revenue` - Get revenue analytics
- `GET /analytics/enrollments` - Get enrollment analytics
- `GET /analytics/course-performance` - Get course performance
- `GET /analytics/student-progress` - Get student progress

## 📁 File Management

### Uploads Module (`/uploads`)

- `POST /uploads/image` - Upload image
- `POST /uploads/video` - Upload video
- `POST /uploads/document` - Upload document
- `DELETE /uploads/:fileId` - Delete file

## ❤️ Health Check

### Health Module (`/health`)

- `GET /health` - Health check
- `GET /health/db` - Database health check

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎭 User Roles

- `STUDENT` - Default role, can enroll in courses
- `INSTRUCTOR` - Can create courses, quizzes, assignments
- `ADMIN` - Administrative access
- `SUPER_ADMIN` - Full system access

## 📝 Notes

### New Features Added:

1. **Chat REST API** - Full conversation and messaging system
2. **Reviews & Ratings** - Course and product reviews with instructor replies
3. **Enrollments** - Progress tracking, lesson completion
4. **Quizzes** - Multiple question types, auto-grading, submissions
5. **Live Sessions** - Video conferencing scheduling and management
6. **Gamification** - Points, badges, achievements, leaderboards
7. **Wishlist & Cart** - Shopping functionality
8. **Coupons** - Discount code system

### WebSocket Features:

- Real-time chat messaging (already implemented in gateway)
- Live notifications (already implemented in gateway)

---

## 🎯 Campaign Management

### Campaigns Module (`/campaigns`)

**Track marketing campaigns with analytics, conversions, and ROI**

- `POST /campaigns` - Create new campaign (Admin)
  - Body: `{ name, description, type, status, startDate, endDate, budget, utmSource, utmMedium, utmCampaign }`
- `GET /campaigns` - Get all campaigns (Admin)
  - Query: `?status=active&page=1&limit=20`

- `GET /campaigns/top` - Get top performing campaigns (Admin)
  - Query: `?limit=10`

- `POST /campaigns/compare` - Compare multiple campaigns (Admin)
  - Body: `{ campaignIds: ["id1", "id2", "id3"] }`

- `GET /campaigns/:id` - Get campaign details (Admin)

- `GET /campaigns/:id/analytics` - Get campaign analytics (Admin)
  - Query: `?dateRange=last_30_days&startDate=2025-01-01&endDate=2025-01-31`

- `PATCH /campaigns/:id` - Update campaign (Admin)

- `DELETE /campaigns/:id` - Delete campaign (Admin)

- `POST /campaigns/track` - Track campaign event (Public)
  - Body: `{ campaignId, eventType, source, medium, value, metadata }`
  - Event Types: `impression`, `click`, `conversion`, `lead`

**Campaign Analytics Includes:**

- Impressions, clicks, conversions, leads
- Revenue tracking and ROI calculation
- CTR (Click-Through Rate)
- Conversion rate
- CPC (Cost Per Click)
- CPA (Cost Per Acquisition)
- Device and source breakdown
- Daily performance timeline

---

## 📊 Page Tracking & Analytics

### Page Tracking Module (`/page-tracking`)

**Track user behavior, page views, and heatmap data**

- `POST /page-tracking/pageview` - Track page view (Public)
  - Body: `{ page, path, title, referrer, sessionId, timeOnPage, scrollDepth, bounced, converted }`

- `POST /page-tracking/event` - Track user event (Public)
  - Body: `{ sessionId, eventType, eventCategory, eventLabel, page, element, positionX, positionY, value }`
  - Event Types: `click`, `scroll`, `form_submit`, `video_play`, etc.

- `GET /page-tracking/analytics` - Get page analytics (Admin)
  - Query: `?page=/courses&startDate=2025-01-01&endDate=2025-01-31`

- `GET /page-tracking/session/:sessionId` - Get session details (Admin)

- `GET /page-tracking/user-flow` - Get user behavior flow (Admin)
  - Shows path navigation patterns

- `GET /page-tracking/heatmap/:page` - Get heatmap data (Admin)
  - Query: `?eventType=click`

- `GET /page-tracking/active-users` - Get real-time active users (Admin)

- `POST /page-tracking/conversion-funnel` - Get conversion funnel (Admin)
  - Body: `{ steps: ["/home", "/courses", "/checkout", "/success"] }`

**Page Analytics Includes:**

- Total page views and unique visitors
- Average time on page
- Average scroll depth
- Bounce rate and conversion rate
- Top pages ranking
- Device, browser, and country breakdown
- Daily page view trends

---

## 👨‍💼 Admin Management APIs

### Admin Module (`/admin`)

**Comprehensive admin APIs for platform management (ADMIN/SUPER_ADMIN only)**

#### Dashboard & System

- `GET /admin/dashboard/stats` - Get dashboard overview
  - Returns: Total users, courses, orders, revenue, enrollments, reviews
  - Growth metrics for current vs last month

- `GET /admin/system/health` - Get system health status
  - Database status, active users, published courses
  - Pending reviews and failed orders alerts

#### User Management

- `GET /admin/users` - Get all users with filters
  - Query: `?page=1&limit=20&role=STUDENT&status=active&search=john`

- `GET /admin/users/:id` - Get detailed user information
  - Includes enrollment history, orders, reviews, and spending stats

- `PATCH /admin/users/:id/status` - Update user status
  - Body: `{ status: "active" | "suspended" | "banned" }`

- `PATCH /admin/users/:id/role` - Update user role
  - Body: `{ role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN" }`

- `DELETE /admin/users/:id` - Delete user (cascade deletes related data)

#### Course Management

- `GET /admin/courses` - Get all courses with filters
  - Query: `?page=1&limit=20&status=pending&category=tech&search=javascript`

- `POST /admin/courses/:id/approve` - Approve pending course

- `POST /admin/courses/:id/reject` - Reject course
  - Body: `{ reason: "Does not meet quality standards" }`

- `DELETE /admin/courses/:id` - Delete course (cascade deletes enrollments, quizzes, etc.)

#### Order Management

- `GET /admin/orders` - Get all orders with filters
  - Query: `?page=1&limit=20&status=completed&paymentStatus=paid`

- `GET /admin/orders/:id` - Get detailed order information

- `PATCH /admin/orders/:id/status` - Update order status
  - Body: `{ status: "pending" | "processing" | "completed" | "failed" | "cancelled" }`

#### Review Moderation

- `GET /admin/reviews/pending` - Get pending reviews for moderation
  - Query: `?page=1&limit=20`

- `POST /admin/reviews/:id/approve` - Approve review

- `POST /admin/reviews/:id/reject` - Reject review

- `DELETE /admin/reviews/:id` - Delete review permanently

#### Analytics & Reports

- `GET /admin/reports/revenue` - Get revenue report
  - Query: `?startDate=2025-01-01&endDate=2025-01-31`
  - Returns: Total revenue, daily breakdown, average order value

- `GET /admin/analytics/top-courses` - Get top performing courses
  - Query: `?limit=10`
  - Returns: Enrollment count, completion rate

- `GET /admin/analytics/top-instructors` - Get top instructors
  - Query: `?limit=10`
  - Returns: Course count, total enrollments

- `GET /admin/coupons/stats` - Get coupon usage statistics
  - Returns: Usage count, limits, active status for all coupons

#### Bulk Operations

- `PATCH /admin/users/bulk/status` - Bulk update user status
  - Body: `{ userIds: ["id1", "id2"], status: "active" | "suspended" | "banned" }`

- `DELETE /admin/users/bulk` - Bulk delete users
  - Body: `{ userIds: ["id1", "id2", "id3"] }`
  - Cascades to delete all related data

#### Instructor Management

- `GET /admin/instructors/pending` - Get pending instructor applications
  - Query: `?page=1&limit=20`

- `POST /admin/instructors/:id/approve` - Approve instructor application

- `POST /admin/instructors/:id/reject` - Reject instructor application
  - Body: `{ reason: "Insufficient qualifications" }`

- `GET /admin/instructors/:id/stats` - Get detailed instructor statistics
  - Returns: Total courses, enrollments, revenue, ratings, course list

#### Content Moderation

- `GET /admin/content/flagged` - Get all flagged content
  - Query: `?page=1&limit=20`

- `POST /admin/content/:id/flag` - Flag content for review
  - Body: `{ contentType: "review" | "course" | "comment", reason: "Inappropriate" }`

- `DELETE /admin/content/:id/flag` - Remove flag from content
  - Body: `{ contentType: "review" | "course" | "comment" }`

#### Platform Statistics

- `GET /admin/platform/stats` - Get comprehensive platform statistics
  - Users: Total and new in last 30 days
  - Courses: Total and new in last 30 days
  - Orders: Total and new in last 30 days
  - Revenue: Total and last 30 days
  - Enrollments: Active, completed, completion rate

- `GET /admin/platform/activity` - Get recent platform activity
  - Query: `?limit=50`
  - Returns: Recent registrations, course creations, orders, enrollments

#### Search & Export

- `GET /admin/search` - Global search across users, courses, orders
  - Query: `?q=searchTerm&limit=10`

- `GET /admin/export/users` - Export users to CSV/JSON
  - Query: `?role=STUDENT&status=active`

- `GET /admin/export/orders` - Export orders to CSV/JSON
  - Query: `?startDate=2025-01-01&endDate=2025-01-31`

---

### API Summary

**Total Endpoints: 140+**

#### By Category:

- Authentication & Users: 15 endpoints
- Course Management: 25 endpoints
- Orders & Payments: 12 endpoints
- Reviews & Ratings: 9 endpoints
- Enrollments & Progress: 10 endpoints
- Quizzes & Assessments: 11 endpoints
- Live Sessions: 14 endpoints
- Gamification: 8 endpoints
- Wishlist & Cart: 7 endpoints
- Coupons & Discounts: 6 endpoints
- Certificates: 5 endpoints
- Discussions & Forums: 13 endpoints
- Assignments: 11 endpoints
- Chat & Messaging: 8 endpoints
- Notifications: 6 endpoints
- Campaigns: 9 endpoints
- Page Tracking: 8 endpoints
- **Admin Management: 35+ endpoints**

---

### Future Enhancements to Consider:

- Video streaming with progress tracking
- Assignment peer review system
- Live session recording and playback
- AI-powered course recommendations
- Advanced analytics and reporting
- Email marketing automation integration
- A/B testing for campaigns
- Advanced fraud detection
