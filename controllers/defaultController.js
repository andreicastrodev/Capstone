const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const Schedule = require('../models/schedule');
const mongoose = require('mongoose');

exports.getIndex = (req, res, next) => {
    res.render('default/index', {
        pageTitle: 'Group 4',
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}

exports.getServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        console.log(services);

        return res.render('default/service/services', {
            pageTitle: 'Services',
            services,
            path: '/',
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.getServicesDetail = async (req, res, next) => {
    const serveId = req.params.serviceId;
    // const serveId = mongoose.Types.ObjectId(req.params.serviceId)
    console.log(serveId)
    try {
        const service = await Service.findById(serveId);
        if (!service) {
            return res.render('/');
        }
        console.log(service)
        return res.render('default/service/services-detail', {
            pageTitle: 'Service Detail',
            service,
            path: "/",
            isAuth: req.session.isLoggedIn
        })

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

}

exports.getInquiry = (req, res, next) => {
    res.render('default/inquiry/inquiry', {
        pageTitle: 'Inquiry',
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}

exports.getProfile = (req, res, next) => {
    res.render('default/profile/profile', {
        pageTitle: 'Profile',
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}


exports.getInquiryHistory = async (req, res, next) => {
    try {

        const inquiries = await Inquiry.find({ userId: req.user._id })
        console.log(inquiries);

        return res.render('default/profile/profile-inquiry-history', {
            pageTitle: 'Inquiry History',
            inquiries,
            path: '/',
            isAuth: req.session.isLoggedIn
        })

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.getScheduleHistory = async (req, res, next) => {

    try {
        const schedules = await Schedule.find({ userId: req.user._id }).populate('serviceId');
        console.log(schedules);

        return res.render('default/profile/profile-schedule-history', {
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

exports.postInquiry = async (req, res, next) => {

    const subject = req.body.subject;
    const message = req.body.message;
    const date = new Date().toDateString();
    console.log(date)
    const inquiry = new Inquiry({
        subject,
        message,
        date,
        status: 'Pending',
        userId: req.user
    })
    try {
        await inquiry.save();
        const result = await req.user.addInquiry(inquiry);
        console.log(result);
        return res.redirect('/');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postServiceSchedule = async (req, res, next) => {

    const date = req.body.date;
    const serviceId = mongoose.Types.ObjectId(req.body.serviceId);
    const schedule = new Schedule({
        date,
        status:'Pending',
        serviceId,
        userId: req.user
    })
    try {
        await schedule.save()
        console.log('SCHEDULE CREATED')
        res.redirect('/profile/schedule-history');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}