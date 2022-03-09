const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/dashboard', adminController.getIndex);
router.get('/create-service', adminController.getCreateService);
router.get('/manage-service', adminController.getManageService);
router.get('/edit-service/:serviceId', adminController.getEditService);
router.get('/create-vote', adminController.getCreateVote);
router.get('/vote-history', adminController.getVoteHistory);
router.get('/manage-inquiry', adminController.getManageInquiry);
router.get('/manage-schedule', adminController.getManageSchedule);
router.get('/manage-user', adminController.getManageUser);
router.get('/manage-vote', adminController.getManageVote);
router.get('/admin-settings', adminController.getAdminSettings);
router.post('/update-settings', adminController.postAdminSettings);
router.post('/create-vote', adminController.postCreateVote);
router.post('/create-service', adminController.postCreateService);
router.post('/edit-service', adminController.postEditService);
router.post('/delete-service', adminController.postDeleteService);
router.post('/delete-inquiry', adminController.postDeleteInquiry);
router.post('/manage-inquiry/mark-as-read', adminController.postReadInquiry);
router.post('/manage-schedule/confirm-schedule', adminController.postConfirmSchedule);
router.post('/manage-schedule/cancel-schedule', adminController.postCancelSchedule);
router.post('/manage-schedule/delete-schedule', adminController.postDeleteSchedule);
router.post('/manage-vote/view-vote', adminController.postViewVote);
router.post('/manage-vote/close-vote', adminController.postCloseVote);
module.exports = router;