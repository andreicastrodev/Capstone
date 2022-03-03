const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const Schedule = require('../models/schedule');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: "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"
        }
    })
);



exports.getIndex = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }

    try {
        const numberOfUsers = await User.countDocuments();
        const numberOfServices = await Service.countDocuments();
        const numberOfInquiry = await Inquiry.countDocuments();
        const numberOfSchedule = await Schedule.countDocuments();
        return res.render('admin/dashboard', {
            pageTitle: 'Admin',
            dataNumber: {
                numberOfServices,
                numberOfUsers,
                numberOfInquiry,
                numberOfSchedule
            },
            path: '/'
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

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


exports.getManageUser = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const users = await User.find();
        console.log(users);
        res.render('admin/user/manage-user', {
            pageTitle: 'Manage Users',
            users,
            path: '',
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.getAdminSettings = async (req, res, next) => {
    const adminDetails = req.admin;
    return res.render('admin/profile/admin-settings', {
        pageTitle: 'Schedule History',
        adminDetails,
        path: '/',
    })
}


exports.postAdminSettings = async (req, res, next) => {

    const updatedEmail = req.body.email;
    const updatedPassword = req.body.password
    try {
        req.admin.email = updatedEmail;

        if (updatedPassword.length > 6 && updatedPassword !== '') {
            const newHashedPassword = await bcrypt.hash(updatedPassword, 12);
            req.admin.password = newHashedPassword;
        }

        const result = await req.admin.save();
        console.log(`admin UPDATED`, result);
        return res.redirect('/admin/admin-settings');
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
        const inquiry = await Inquiry.findById(inquiryId).populate('userId');
        inquiry.status = 'Read';
        await inquiry.save();
        console.log('INQUIRY READ');
        transporter.sendMail({
            to: inquiry.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'About your Inquiry',
            html: `
              <p>Good day!</p>
              <p>We have read your concern about this certain topic, we will email you again if we confirmed it.</p>
            `
        });
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
        const schedule = await Schedule.findById(scheduleId).populate('userId');
        console.log(schedule)
        schedule.status = 'Confirmed';
        await schedule.save();
        console.log('SCHEDULE CONFIRMED');
        transporter.sendMail({
            to: schedule.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'Confirmation Of Schedule',
            html: `
              <p>Good day!</p>
              <p>Your shedule has been approved, please go to the barangay at 12pm nooon of 24th.</p>
            `
        });
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
        const schedule = await Schedule.findById(scheduleId).populate('userId')
        schedule.status = 'Cancelled';
        await schedule.save();
        console.log('SCHEDULE Cancelled');
        transporter.sendMail({
            to: schedule.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'Cancelation Of Schedule',
            html: `
              <p>Good day!</p>
              <p>Your shedule has been cancelled, your schedule cannot be processed because we are fully booked, please schedule on a different date.</p>
            `
        });
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