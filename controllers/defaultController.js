const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const Schedule = require('../models/schedule');
const Vote = require('../models/vote');
const bcrypt = require('bcryptjs');
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

    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('default/inquiry/inquiry', {
        pageTitle: 'Inquiry',
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}

exports.getProfile = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('default/profile/profile', {
        pageTitle: 'Profile',
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}


exports.getInquiryHistory = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
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
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
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


exports.getSettings = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const userDetails = req.user;
    return res.render('default/profile/profile-settings', {
        pageTitle: 'Settings',
        userDetails,
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}

exports.getVotes = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }

    try {
        const votes = await Vote.find();
        console.log(votes);
        return res.render('default/vote/votes', {
            pageTitle: 'Votes',
            path: '/',
            votes,
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }


}



exports.getVotesDetails = async (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }

    const voteId = req.params.voteId;

    try {
        const vote = await Vote.findById(voteId);
        console.log(vote);
        return res.render('default/vote/vote-details', {
            pageTitle: 'Vote Details',
            path: '/',
            vote,
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

}

exports.getVoteResults = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }

    return res.render('default/vote/vote-results', {
        pageTitle: 'Vote Results',
        path: '/',
        isAuth: req.session.isLoggedIn
    })
}

exports.postSettings = async (req, res, next) => {
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const updatedMobileNumber = req.body.mobileNumber;
    const updatedPassword = req.body.password
    try {
        req.user.name = updatedName;
        req.user.email = updatedEmail;
        req.user.mobileNumber = updatedMobileNumber;

        if (updatedPassword.length > 6 && updatedPassword !== '') {
            const newHashedPassword = await bcrypt.hash(updatedPassword, 12);
            req.user.password = newHashedPassword;
        }

        const result = await req.user.save();
        console.log(`USER UPDATED`, result);
        return res.redirect('/profile/settings');
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
        status: 'Pending',
        serviceId,
        userId: req.user._id
    })
    try {
        await schedule.save()
        console.log(`this is schedule`, schedule);
        const result = await req.user.addSchedule(schedule);
        console.log(result)
        console.log('SCHEDULE CREATED')
        res.redirect('/profile/schedule-history');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}