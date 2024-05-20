import asyncHandler from "express-async-handler";
import { CouponCode, Course } from "../teacher/course.model";
import { CoursePoints } from "../auth/coursePoints.model";
import mongoose from "mongoose";
import { PendingBuyer } from "./pendingBuyer.model";
import { Payment } from "../teacher/payments.model";
import { Notification } from "../admin/notification.model";

const getCourses = asyncHandler(async (req, res, next) => {
  const { category, price, status } = req.query;
  const coursePipeline: any = [
    {
      $match: {
        isPublish: true,
      },
    },

    {
      $lookup: {
        from: "chapters",
        localField: "chapters",
        foreignField: "_id",
        as: "courseChapters",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "teacher",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              qualification: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: "$teacher",
    },

    {
      $project: {
        couponCode: 0,
        chapters: 0,
        creator: 0,
        purchasers: 0,
      },
    },
  ];
  if (req.body.user && req.body.user.id) {
    coursePipeline[0].$match.creator = {
      $ne: new mongoose.Types.ObjectId(req.body.user.id),
    };
  }
  const courses = await Course.aggregate(coursePipeline);

  const realCourses = courses?.map((crs) => {
    if (crs.price) {
      return {
        title: crs.title,
        thumbnail: crs.thumbnail,
        category: crs.category,
        description: crs.description,
        teacher: crs.teacher,
        status: crs.status,
        price: crs.price,
        _id: crs._id,
      };
    } else {
      return crs;
    }
  });

  console.log(realCourses);

  res.status(200).json(realCourses);
});

const getErolledCourseDetails = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;

  if (!courseId) {
    return next({ status: 404, message: "Course Id is required" });
  }

  const coursePointDetails = await CoursePoints.findOne({
    courseId,
    user: req.body.user.id,
  });
  if (coursePointDetails) {
    res.status(200).json(coursePointDetails);
  } else {
    return next({ message: "Course not found", status: 404 });
  }
});

const enrollInFreeCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  if (!courseId) {
    return next({ status: 404, message: "Course Id is required" });
  }

  const addCourseToPoints = await CoursePoints.create({
    courseId,
    user: req.body.user.id,
  });

  res.status(201).json({ message: "Enrolled in free course successfully" });
});

const onCompleteChapter = asyncHandler(async (req, res, next) => {
  const { courseId, chapterId } = req.query;
  if (!courseId || !chapterId) {
    return next({
      status: 404,
      message: "Course Id and Chapter Id is required",
    });
  }
  const course = await Course.findById(courseId);
  const updateCoursePoints = await CoursePoints.findOneAndUpdate(
    { courseId, user: req.body.user.id },
    {
      $inc: { points: 5 },
      $push: { chapters: chapterId },
    },
    { new: true }
  );

  if (updateCoursePoints && course?.chapters?.length) {
    const isCourseCompleted =
      updateCoursePoints.points === course?.chapters?.length * 5;
    if (isCourseCompleted) {
      updateCoursePoints.courseCompleted = true;
      await updateCoursePoints.save();
      res.status(201).json({ message: "Course completed successfully" });
      return;
    } else {
      res.status(200).json({ message: "chapter completed successfully" });
    }
  } else {
    next({});
  }
});

const getCompletedChapters = asyncHandler(async (req, res, next) => {
  const { user } = req.body;
  const { courseId } = req.query;
  if (!courseId) {
    return next({ status: 404, message: "Course Id is required" });
  }

  const coursePoints = await CoursePoints.findOne({ courseId, user: user.id });

  if (coursePoints) {
    res.status(200).json(coursePoints.chapters);
  } else {
    return next({ status: 404, message: "No course points found" });
  }
});

const applyCouponCode = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;

  const updateCouponPoints = await CouponCode.findOneAndUpdate(
    { courseId },
    {
      $inc: { quantity: -1 },
      $push: { couponUsers: req.body.user.id },
    }
  );

  res.status(200).json({ message: "Coupon Code applied successfully" });
});

const getCouponCode = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  if (!courseId) {
    return next({ message: "Course Id  required", status: 404 });
  }

  const couponCode = await CouponCode.findOne({
    courseId,
    couponUsers: req.body.user.id,
  });

  if (couponCode) {
    res.status(200).json(couponCode.coupon);
  } else {
    next({ status: 404, message: "No coupon code found" });
  }
});

const getMyNotifications = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const userNotifications = await Notification.find({
    user: user.id,
  });

  res.status(200).json(userNotifications);
});

const readNotification = asyncHandler(async (req, res, next) => {
  const { notificationId } = req.body;
  if (!notificationId) {
    return next({ message: "Notification Id  required", status: 404 });
  }
  await Notification.findByIdAndUpdate(notificationId, {
    read: true,
  });

  res.status(201).json({ message: "Notification readed" });
});

const purchaseCourse = asyncHandler(async (req, res, next) => {
  const { session } = req.body;
  res.status(200).json({ id: session.id });
});

const paymentSucceed = asyncHandler(async (req, res, next) => {
  const { id, courseId } = req.body;

  if (!id || !courseId) {
    return next({ message: "Id and Course Id  required", status: 404 });
  }
  const buyerExist = await PendingBuyer.findOne({
    user: req.body.user.id,
    courseId,
    _id: id,
  });

  if (!buyerExist) {
    return next({ message: "Invalid secret id", status: 404 });
  }
  const updateCourse = await Course.findByIdAndUpdate(courseId, {
    $push: { purchasers: req.body.user.id },
  });

  await Payment.create({
    courseId,
    purchaser: req.body.user.id,
    price: buyerExist.price,
  });
  await PendingBuyer.findByIdAndDelete(buyerExist._id);
  if (updateCourse) {
    res.status(200).json({ message: "Payment Successfull" });
  } else {
    next({ message: "Something went wrong", status: 404 });
  }
});

const getMyPaidCourses = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const myPurchasedCourses = await Course.find({
    purchasers: user.id,
  });

  const purchasedCoursesIds = myPurchasedCourses?.map((course) => course._id);

  res.status(200).json(purchasedCoursesIds);
});

const getMyPaidCourseChaptersTitles = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id) {
    return next({ message: " Course Id  required", status: 404 });
  }

  const course = await Course.findOne({
    _id: id,
    purchasers: user.id,
  }).populate({
    path: "chapters",
    select: "title",
  });
  res.status(200).json(course?.chapters || []);
});

const enrollInPaidCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  if (!courseId) {
    return next({ status: 404, message: "Course Id is required" });
  }

  const course = await Course.findOne({
    _id: courseId,
    purchasers: req.body.user.id,
  });

  if (!course) {
    return next({ status: 404, message: "Please purchased the course" });
  }

  const addCourseToPoints = await CoursePoints.create({
    courseId,
    user: req.body.user.id,
  });

  res.status(201).json({ message: "Enrolled in Paid course successfully" });
});

const getPaidCourseContent = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  if (!courseId) {
    return next({ status: 404, message: "Course Id is required" });
  }

  const coursePipeline: any = [
    {
      $match: {
        isPublish: true,
        _id: new mongoose.Types.ObjectId(courseId as string),
        purchasers: new mongoose.Types.ObjectId(req.body.user.id),
      },
    },

    {
      $lookup: {
        from: "chapters",
        localField: "chapters",
        foreignField: "_id",
        as: "courseChapters",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "teacher",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              qualification: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: "$teacher",
    },

    {
      $project: {
        couponCode: 0,
        chapters: 0,
        creator: 0,
        purchasers: 0,
      },
    },
  ];
  const course = await Course.aggregate(coursePipeline);

  if (!course) {
    return next({ status: 404, message: "Please purchased the course" });
  }
  res.status(200).json(course);
});

const getAllCoursesPoints = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const coursePoints = await CoursePoints.find({
    user: new mongoose.Types.ObjectId(user.id),
  }).select("points");

  const totalPoints = coursePoints?.reduce((acc: any, detail: any) => {
    acc += detail.points;
    return acc;
  }, 0);

  res.status(200).json({ totalPoints });
});

const getMyAllCourses = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const enrolledCourses = await CoursePoints.find({
    user: new mongoose.Types.ObjectId(user.id),
  }).select("courseId");
  res.status(200).json(enrolledCourses);
});

export {
  getCourses,
  getErolledCourseDetails,
  enrollInFreeCourse,
  onCompleteChapter,
  getCompletedChapters,
  applyCouponCode,
  getCouponCode,
  purchaseCourse,
  paymentSucceed,
  getMyPaidCourses,
  getMyPaidCourseChaptersTitles,
  enrollInPaidCourse,
  getPaidCourseContent,
  getAllCoursesPoints,
  getMyAllCourses,
  getMyNotifications,
  readNotification,
};
