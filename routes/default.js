const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')

router.get('/', defaultController.getIndex);

router.get('/services', defaultController.getServices);
router.get('/services/:serviceId', defaultController.getServicesDetail);
router.get('/inquiry', defaultController.getInquiry);
router.get('/profile', defaultController.getProfile);
router.get('/profile/inquiry-history', defaultController.getInquiryHistory)
router.get('/profile/schedule-history', defaultController.getScheduleHistory);
router.get('/profile/settings', defaultController.getSettings);
router.get('/votes', defaultController.getVotes);
router.get('/vote/vote-details', defaultController.getVoteDetails);
router.get('/vote/vote-results', defaultController.getVoteResults);
router.post('/inquiry', defaultController.postInquiry);
router.post('/service-schedule', defaultController.postServiceSchedule);
router.post('/profile/update-settings', defaultController.postSettings);
module.exports = router;