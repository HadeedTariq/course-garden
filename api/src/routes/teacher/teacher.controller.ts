import asyncHandler from "express-async-handler";
import { CouponCode, Course } from "./course.model";
import mongoose from "mongoose";
import { Chapter } from "./chapter.model";
import { Payment } from "./payments.model";
import { pool } from "../../app";

const createCourse = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    thumbnail,
    couponCode: { coupon, quantity },
    category,
    user,
  } = req.body;

  if (
    !title ||
    !description ||
    !thumbnail ||
    !coupon ||
    !quantity ||
    !category
  ) {
    return next({ status: 404, message: "Please fill all the fields" });
  }
  const { rows: createdCourse } = await pool.query(
    `
    INSERT INTO course (
      title,
      description,
      thumbnail,
      status,
      category,
      creator
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
      returning *;
  `,
    [title, description, thumbnail, "free", category, user.id]
  );
  await pool.query(
    `
    INSERT INTO couponcode (
     coupon,
     quantity,
     courseid
    ) VALUES (
      $1, $2,$3
    )
  `,
    [coupon, quantity, createdCourse[0].courseid]
  );
  res.status(201).json("Course created successfully");
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next({ status: 404, message: "Course Id is required" });
  }

  await pool.query(`delete from course where courseid=$1`, [id]);

  res.status(200).json({ message: "Course deleted successfully" });
});

const getCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next({ message: "Course Id must be true", status: 404 });
  }
  const { rows: course } = await pool.query(
    `SELECT 
    cu.title AS course_title,
    cu.description AS course_description,
    cu.thumbnail AS course_thumbnail,
    json_agg(
        json_build_object(
            'chapter_title', ch.title,
            'chapter_description', ch.description,
            'chapter_thumbnail', ch.thumbnail
        )
    ) AS chapters
FROM 
    course cu
    INNER JOIN 
    chapters ch ON ch.courseid = cu.courseid
    WHERE 
    cu.courseid = $1
    GROUP BY 
    cu.title, cu.description, cu.thumbnail;
  `,
    [id]
  );
  if (!course[0]) {
    return next({
      message: "Course Not found or course doesn't have any chapters",
      status: 404,
    });
  }

  res.status(200).json(course[0]);
});

const publishCourse = asyncHandler(async (req, res, next) => {
  const { status, price, courseId, user } = req.body;
  if (!status || (status === "paid" && !price) || !courseId) {
    return next({ message: "Please fill all the fields", status: 404 });
  }
  const { rowCount } = await pool.query(
    `UPDATE course
    SET 
        status = $1,
        price = $2,
        isPublish = $3
    WHERE 
        courseid = $4 
     AND 
      creator=$5   
    `,
    [status, price, true, courseId, user.id]
  );

  if (Number(rowCount) > 0) {
    res.status(201).json({ message: "Course published successfully" });
  } else {
    return next({ message: "Check your courseid", status: 404 });
  }
});

const myCourses = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const { rows: courses } = await pool.query(
    `SELECT json_agg(
      json_build_object(
        'course_title', cu.title,
        'course_description', cu.description,
        'course_thumbnail', cu.thumbnail,
        'chapters',(
          SELECT json_agg(
            json_build_object(
              'chapter_title', ch.title,
              'chapter_description', ch.description,
              'chapter_thumbnail', ch.thumbnail
            )
          )
          FROM chapters ch 
          WHERE ch.courseid=cu.courseid
        )
      )
    ) AS courses
    FROM 
     course cu
    WHERE
     cu.creator=$1
    `,
    [user.id]
  );

  res.status(200).json(courses[0]);
});

const getCourseRevenue = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;

  if (!courseId) {
    return next({ message: "Course Id must be required", status: 404 });
  }

  const { rows: revenueDetails } = await pool.query(
    `WITH monthly_revenue_cte AS (
    SELECT 
        SUM(regexp_replace(p.price, '[^0-9]', '', 'g')::INTEGER) AS monthly_revenue
    FROM 
        payment p
    WHERE 
        p.courseid = $1
        AND p.createdAt > NOW() - INTERVAL '30 days'
    )
    SELECT 
        p.courseid,
        SUM(regexp_replace(p.price, '[^0-9]', '', 'g')::INTEGER) AS total_revenue,
        (select monthly_revenue from monthly_revenue_cte) as monthly_revenue,
        json_agg(
            json_build_object(
                'username', u.username,
                'email', u.email,
                'avatar', u.avatar,
                'purchaseDate', p.createdAt,
                'price', p.price
            )
        ) AS purchasers
    FROM 
        payment p
    INNER JOIN 
        users u ON u.userid = p.purchaser
    WHERE 
        p.courseid = $1
    GROUP BY 
        p.courseid`,
    [Number(courseId)]
  );
  res.status(200).json(revenueDetails[0]);
});

export {
  createCourse,
  getCourseById,
  publishCourse,
  myCourses,
  deleteCourse,
  getCourseRevenue,
};
