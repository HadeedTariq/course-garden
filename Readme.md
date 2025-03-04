# Course Garden

## Overview

This is a modern course platform that provides a seamless experience for students and teachers, offering all essential functionalities such as course creation, enrollment, payments, feedback, and authentication.

## Features

### Authentication & User Roles
- **User Registration & Login**: Secure authentication system with JWT-based token management.
- **Role-Based Access**: Users can be students, teachers, or admins, each with specific privileges.
- **Token Refresh & Logout**: Secure session handling with refresh tokens.

### Course Management
- **Create & Publish Courses**: Teachers can create, manage, and publish courses.
- **Enroll in Courses**: Students can enroll in both free and paid courses.
- **Track Progress**: Completed chapters are stored and tracked.
- **Revenue Tracking**: Teachers can view earnings from their courses.

### Payment Integration (Challenge & Solution)
One challenge was handling payment webhooks, which are not compatible with serverless environments. The solution:
- **Custom Unique Payment ID System**
  - A unique transaction ID is generated and stored in the database before payment.
  - The frontend receives this ID and submits it during payment confirmation.
  - Instead of relying on webhooks, the backend validates the payment by checking the unique ID.
  - Ensures secure and reliable transaction processing without external webhooks.

### Course Interaction
- **Playlists**: Users can create and manage playlists.
- **Feedback & Reviews**: Students can provide feedback, and teachers can respond.
- **Notifications**: Users receive updates on course progress and announcements.

### Admin Dashboard
- **Teacher Approval System**: Users can request to become teachers; admins approve/reject requests.
- **Manage Users & Courses**: Admins oversee platform activities and user roles.
 ___ 



## API Endpoints

### **Authentication Routes**
| Method | Endpoint | Description |
|--------|-------------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | User login |
| POST | `/` | Authenticate user |
| POST | `/refreshAccessToken` | Refresh access token |
| POST | `/logout` | Logout user |

### **Teacher Routes** (Protected - Only Teachers)
| Method | Endpoint | Description |
|--------|-------------|-------------|
| GET | `/course/myCourses` | Get all courses created by the teacher |
| POST | `/createCourse` | Create a new course |
| DELETE | `/deleteCourse/:id` | Delete a course by ID |
| GET | `/course/revenue` | Get course revenue |
| GET | `/course/:id` | Get course details by ID |
| POST | `/course/publish` | Publish a course |

### **Student Routes** (Protected - Only Students)
| Method | Endpoint | Description |
|--------|-------------|-------------|
| GET | `/` | Get all available courses |
| GET | `/notifications` | Get student notifications |
| POST | `/notification/read` | Mark notification as read |
| GET | `/course/coursePoints` | Get enrolled course details |
| POST | `/course/enroll/freeCourse` | Enroll in a free course |
| PUT | `/course/completeChapter` | Mark a chapter as completed |
| GET | `/course/myCompletedChapters` | Get completed chapters |
| POST | `/course/applyCouponCode` | Apply a coupon code |
| GET | `/course/checkCoupon` | Check coupon validity |
| POST | `/course/purchase` | Purchase a course |
| POST | `/course/paymentSucceed` | Confirm payment |
| GET | `/course/myPurchasedCourses` | Get list of purchased courses |
| GET | `/paidCourse/:id/chapterTitles` | Get chapter titles for a paid course |
| POST | `/course/enroll/paidCourse` | Enroll in a paid course |
| GET | `/paidCourse/content` | Get paid course content |
| GET | `/courses/allPoints` | Get all course points |
| GET | `/courses/all` | Get all courses enrolled by student |

### **Chapter Routes** (Protected - Only Teachers)
| Method | Endpoint | Description |
|--------|-------------|-------------|
| POST | `/create` | Create a chapter in a course |

### **Playlist Routes** (Protected - Authenticated Users)
| Method | Endpoint | Description |
|--------|-------------|-------------|
| POST | `/create` | Create a new playlist |
| GET | `/myPlaylists` | Get user playlists |
| PUT | `/update` | Update an existing playlist |

### **Feedback Routes** (Protected - Authenticated Users)
| Method | Endpoint | Description |
|--------|-------------|-------------|
| POST | `/create` | Submit course feedback |
| POST | `/reply` | Reply to feedback |
| GET | `/` | Get all feedbacks for a course |

### **Admin Routes** (Protected - Only Admins)
| Method | Endpoint | Description |
|--------|-------------|-------------|
| POST | `/requestForTeacher` | Request to become a teacher |
| GET | `/checkAdmin` | Check if the user is an admin |
| GET | `/teacherRequests` | Get all teacher requests |
| PUT | `/approveTeacher` | Approve a teacher request |
| PUT | `/rejectTeacher` | Reject a teacher request |

## **Installation**

### 1. Server

1. Clone the repository:
   ```bash
   git clone https://github.com/HadeedTariq/course-garden
   ```
2. Navigate to the backend directory:
   ```bash
   cd api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` in **api** folder and add the following:

    ```ini
    # Client URL (Frontend URL)
    CLIENT_URL=http://localhost:3000
    
    # MongoDB Connection String
    DB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
    
    # Server Port
    PORT=5000
    
    # Node Environment (development/production)
    NODE_ENV=development
    
    # JWT Secrets
    JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
    JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
    
    # Stripe API Key
    STRIPE_API_KEY=your_stripe_api_key
    
    ```

⚠ **Note:** Ensure that you replace the placeholder values with your actual credentials. Never share your `.env` file publicly.

---

### 2. Client

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` in **client** folder and add the following:

    ```ini
    VITE_BACKEND_URL=http://localhost:5000
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

    ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

