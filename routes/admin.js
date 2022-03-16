const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController');
const adminIsAuth = require('../middleware/adminIsAuth');
const { check } = require('express-validator/check');
const validators = require('../validators/adminValidator');
router.get('/dashboard', adminIsAuth.adminIsAuth, adminController.getIndex);
router.get('/create-news', adminIsAuth.adminIsAuth, adminController.getCreateNews);
router.get('/manage-news', adminIsAuth.adminIsAuth, adminController.getManageNews);
router.get('/manage-news/edit-news/:newsId', adminIsAuth.adminIsAuth, adminController.getEditNews);
router.get('/create-service', adminIsAuth.adminIsAuth, adminController.getCreateService);
router.get('/manage-service', adminIsAuth.adminIsAuth, adminController.getManageService);
router.get('/edit-service/:serviceId', adminIsAuth.adminIsAuth, adminController.getEditService);
router.get('/create-vote', adminIsAuth.adminIsAuth, adminController.getCreateVote);
router.get('/vote-history', adminIsAuth.adminIsAuth, adminController.getVoteHistory);
router.get('/manage-inquiry', adminIsAuth.adminIsAuth, adminController.getManageInquiry);
router.get('/manage-schedule', adminIsAuth.adminIsAuth, adminController.getManageSchedule);
router.get('/manage-user', adminIsAuth.adminIsAuth, adminController.getManageUser);
router.get('/manage-vote ', adminIsAuth.adminIsAuth, adminController.getManageVote);
router.get('/admin-settings', adminIsAuth.adminIsAuth, adminController.getAdminSettings);
router.post('/update-settings', adminIsAuth.adminIsAuth, adminController.postAdminSettings);
router.post('/create-news', adminIsAuth.adminIsAuth, validators.validateNews, adminController.postCreateNews);
router.post('/create-vote', adminIsAuth.adminIsAuth, validators.validateVotes, adminController.postCreateVote);
router.post('/create-service', adminIsAuth.adminIsAuth, validators.validateServices, adminController.postCreateService);
router.post('/edit-service', adminIsAuth.adminIsAuth, adminController.postEditService);
router.post('/delete-service', adminIsAuth.adminIsAuth, adminController.postDeleteService);
router.post('/delete-inquiry', adminIsAuth.adminIsAuth, adminController.postDeleteInquiry);
router.post('/manage-news/edit-news', adminIsAuth.adminIsAuth, adminController.postEditNews);
router.post('/manage-news/delete-news', adminIsAuth.adminIsAuth, adminController.postDeleteNews);
router.post('/manage-inquiry/mark-as-read', adminIsAuth.adminIsAuth, adminController.postReadInquiry);
router.post('/manage-schedule/confirm-schedule', adminIsAuth.adminIsAuth, adminController.postConfirmSchedule);
router.post('/manage-schedule/cancel-schedule', adminIsAuth.adminIsAuth, adminController.postCancelSchedule);
router.post('/manage-schedule/delete-schedule', adminIsAuth.adminIsAuth, adminController.postDeleteSchedule);
router.post('/manage-vote/view-vote', adminIsAuth.adminIsAuth, adminController.postViewVote);
router.post('/manage-vote/close-vote', adminIsAuth.adminIsAuth, adminController.postCloseVote);
module.exports = router;