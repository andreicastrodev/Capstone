const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')
const { check } = require('express-validator/check');
const validators = require('../validators/defaultValidator');
const defaultIsAuth = require('../middleware/defaultIsAuth');
router.get('/', defaultController.getIndex);
router.get("/news/:newsId", defaultController.getNews);
router.get('/services', defaultController.getServices);
router.get('/services/:serviceId', defaultController.getServicesDetail);
router.get('/inquiry', defaultIsAuth.defaultIsAuth, defaultController.getInquiry);
router.get('/profile', defaultIsAuth.defaultIsAuth, defaultController.getProfile);
router.get('/profile/inquiry-history', defaultIsAuth.defaultIsAuth, defaultController.getInquiryHistory)
router.get('/profile/schedule-history', defaultIsAuth.defaultIsAuth, defaultController.getScheduleHistory);
router.get('/profile/schedule/:scheduleId', defaultIsAuth.defaultIsAuth, defaultController.getScheduleInvoice);
router.get('/profile/vote-history', defaultIsAuth.defaultIsAuth, defaultController.getVoteHistory);
router.get('/profile/settings', defaultIsAuth.defaultIsAuth, defaultController.getSettings);
router.get('/votes', defaultIsAuth.defaultIsAuth, defaultController.getVotes);
router.get('/votes/:voteId', defaultIsAuth.defaultIsAuth, defaultController.getVotesDetails);
router.get('/vote/vote-results', defaultIsAuth.defaultIsAuth, defaultController.getVoteResults);
router.post('/vote/voted', defaultIsAuth.defaultIsAuth, defaultController.postVoted);
router.post('/inquiry', defaultIsAuth.defaultIsAuth, validators.validateInquiry, defaultController.postInquiry);
router.post('/service-schedule', defaultIsAuth.defaultIsAuth,validators.validateSchedule, defaultController.postServiceSchedule );
router.post('/profile/update-settings', defaultIsAuth.defaultIsAuth, defaultController.postSettings);
module.exports = router;