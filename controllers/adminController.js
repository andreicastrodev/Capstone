const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const Schedule = require('../models/schedule');

const mongoose = require('mongoose');
exports.getIndex = (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }

    res.render('admin/dashboard', {
        pageTitle: 'Admin',
        path: '/'
    })
}

exports.getCreateService = (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    res.render('admin/services/create-service', {
        pageTitle: 'Create Service',
        path: '/'
    })
}

exports.getManageService = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const services = await Service.find();
        console.log(services)

        return res.render('admin/services/manage-service', {
            pageTitle: 'Manage Service',
            services,
            path: '/'
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.getEditService = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    const serveId = req.params.serviceId;
    try {
        const service = await Service.findById(serveId);
        console.log(service)
        return res.render('admin/services/edit-service', {
            pageTitle: 'Edit Service',
            service,
            path: '/'
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.getManageInquiry = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const inquiries = await Inquiry.find().populate('userId')
        console.log(inquiries);
        return res.render('admin/inquiry/manage-inquiry', {
            pageTitle: 'Manage Inquiry',
            inquiries,
            path: '/'
        })
    } catch (error) {

    }

}


exports.getManageSchedule = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const schedules = await Schedule.find().populate('serviceId').populate('userId');
        console.log(schedules);

        return res.render('admin/schedule/manage-schedule', {
            pageTitle: 'Schedule History',
            schedules,
            path: '/',
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}




exports.postCreateService = async (req, res, next) => {
    const title = req.body.title;
    const location = req.body.location;
    const description = req.body.description;
    const image = req.file;

    console.log(image)
    if (!image) {
        return res.redirect('/admin/dashboard');
    }
    const imageUrl = image.path;

    const service = new Service({
        title,
        location,
        description,
        imageUrl
    })
    try {
        const result = await service.save()
        return res.redirect('/admin/dashboard');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postEditService = async (req, res, next) => {
    const serveId = req.body.serveId;
    const updatedTitle = req.body.title;
    const updatedLocation = req.body.location;
    const updatedDescription = req.body.description;
    const image = req.file;
    console.log(`this is the id ${serveId}`);

    try {
        const service = await Service.findById(serveId);
        console.log('service')
        service.title = updatedTitle;
        service.location = updatedLocation;
        service.description = updatedDescription;
        if (image) {
            service.imageUrl = image.path;
        }
        const result = await service.save();
        console.log(`${result} service updated`);
        return res.redirect('/admin/manage-service');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

}


exports.postDeleteService = async (req, res, next) => {

    const serveId = req.body.serviceId;
    try {
        await Service.deleteOne({ _id: serveId });
        console.log('SERVICE DELETED');
        return res.redirect('/admin/manage-service')
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

}

exports.postDeleteInquiry = async (req, res, next) => {
    const inquiryId = req.body.inquiryId;
    try {
        await Inquiry.deleteOne({ _id: inquiryId });
        await req.user.removeInquiry(inquiryId);
        console.log('INQUIRY DELETED');
        return res.redirect('/admin/manage-inquiry');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postReadInquiry = async (req, res, next) => {
    const inquiryId = req.body.inquiryId;
    try {
        const inquiry = await Inquiry.findById(inquiryId);
        inquiry.status = 'Read';
        await inquiry.save();
        console.log('INQUIRY READ');
        return res.redirect('/admin/manage-inquiry');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.postConfirmSchedule = async (req, res, next) => {
    const scheduleId = req.body.scheduleId

    try {
        const schedule = await Schedule.findById(scheduleId)
        schedule.status = 'Confirmed';
        await schedule.save();
        console.log('SCHEDULE CONFIRMED');
        return res.redirect('/admin/manage-schedule');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.postCancelSchedule = async (req, res, next) => {
    const scheduleId = req.body.scheduleId

    try {
        const schedule = await Schedule.findById(scheduleId)
        schedule.status = 'Cancelled';
        await schedule.save();
        console.log('SCHEDULE Cancelled');
        return res.redirect('/admin/manage-schedule');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.postDeleteSchedule = async (req, res, next) => {
    const scheduleId = req.body.scheduleId;
    try {
        await Schedule.deleteOne({ _id: scheduleId });
        await req.user.removeSchedule(scheduleId);
        console.log('SCHEDULE DELETED');
        return res.redirect('/admin/manage-schedule');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}