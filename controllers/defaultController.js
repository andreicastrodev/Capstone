const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const mongoose = require('mongoose');

exports.getIndex = (req, res, next) => {
    res.render('default/index', {
        pageTitle: 'Group 4',
        path: '/'
    })
}

exports.getServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        console.log(services);

        return res.render('default/service/services', {
            pageTitle: 'Services',
            services,
            path: '/'
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
            path: "/"
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
        path: '/'
    })
}

exports.getProfile = (req, res, next) => {
    res.render('default/profile/profile', {
        pageTitle: 'Profile',
        path: '/'
    })
}


exports.getInquiryHistory = async (req, res, next) => {


    try {
        const inquiries = await Inquiry.find();
        console.log(inquiries);

        return res.render('default/profile/profile-inquiry-history', {
            pageTitle: 'Inquiry History',
            inquiries,
            path: '/'
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
        date
    })
    try {
        await inquiry.save();
        return res.redirect('/');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}