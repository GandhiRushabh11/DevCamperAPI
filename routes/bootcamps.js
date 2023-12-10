const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamp");

const Bootcamp = require('../models/Bootcamp')


// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers 
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize("admin", "publisher"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("admin", "publisher"), updateBootcamp)
  .delete(protect, authorize("admin", "publisher"), deleteBootcamp)
router
  .route("/:id/photo")
  .put(protect, authorize("admin", "publisher"), bootcampPhotoUpload);
module.exports = router;
