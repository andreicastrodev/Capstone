const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const Schedule = require('../models/schedule');
const Vote = require('../models/vote');
const VoteData = require('../models/voteData');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const News = require('../models/news');

exports.getIndex = async (req, res, next) => {

    try {

        const news = await News.find();
        console.log(news)
        res.render('default/index', {
            pageTitle: 'Group 4',
            path: '/',
            newsData: news,
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }


}


exports.getNews = async (req, res, next) => {

    const newsId = req.params.newsId;


    try {
        const news = await News.findById(newsId);
        res.render('default/news/news-page', {
            pageTitle: 'News page',
            path: '/',
            news,
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }


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

exports.getVoteHistory = async (req, res, next) => {
    try {
        const [votes] = await User.find({ _id: req.user._id })
            .populate({
                path: 'data',
                populate: {
                    path: 'vote',
                    populate: {
                        path: 'voteDataId',
                        model: 'Vote'
                    }
                }
            })
        const voteData = votes.data.vote;

        return res.render('default/profile/profile-vote-history', {
            pageTitle: 'vote History',
            votes: voteData,
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
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const voteId = req.params.voteId;
    let alreadyVoted;
    try {
        const vote = await Vote.findById(voteId);
        const [voteData] = await VoteData.find({ "voteId": mongoose.Types.ObjectId(voteId) })
            .populate('voteId');

        if (voteData) {
            alreadyVoted = voteData.votees.find(votee => votee.toString() === req.user._id.toString());
        }
        return res.render('default/vote/vote-details', {
            pageTitle: 'Vote Details',
            path: '/',
            vote,
            alreadyVoted,
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


exports.postVoted = async (req, res, next) => {
    const voteId = mongoose.Types.ObjectId(req.body.voteId);
    let vote;
    let selectedVote;
    const voteCount = Array(3).fill(0);
    const date = new Date().toDateString();

    const [existingVote] = await VoteData.find({ "voteId": voteId }).populate('voteId');
    const [voteDetails] = await Vote.find(voteId);
    try {
        if (existingVote) {
            if (+req.body.vote === 0) {
                vote = +req.body.vote;
                selectedVote = +req.body.vote;
                existingVote.voteCount[0]++
            } else if (+req.body.vote === 1) {
                vote = +req.body.vote;
                selectedVote = +req.body.vote;
                existingVote.voteCount[1]++
            } else {
                vote = +req.body.vote;
                selectedVote = +req.body.vote;
                existingVote.voteCount[2]++
            }
            existingVote.votees.push(req.user._id);
            const results = await existingVote.save();
            const existingUserVote = results.votees.find(user => user.toString() === req.user._id.toString());
            if (!existingUserVote) await req.user.addVote(voteDetails, selectedVote, date);

            return res.render('default/vote/vote-results', {
                pageTitle: 'Vote Results',
                path: '/',
                voteResults: existingVote,
                isAuth: req.session.isLoggedIn
            })
        } else {

            if (+req.body.vote === 0) {
                vote = +req.body.vote;
                selectedVote = +req.body.vote;
                voteCount[0]++
            } else if (+req.body.vote === 1) {
                vote = +req.body.vote;
                selectedVote = +req.body.vote;
                voteCount[1]++
            } else {
                vote = +req.body.vote;
                selectedVote = +req.body.vote;
                voteCount[2]++
            }
            const votees = [];
            votees.push(req.user._id);

            const voteData = new VoteData({
                votees,
                voteCount,
                voteId
            })
            const displayResult = await voteData.save()
            await displayResult.populate('voteId')
            await req.user.addVote(voteDetails, selectedVote, date);

            return res.render('default/vote/vote-results', {
                pageTitle: 'Vote Results',
                path: '/',
                voteResults: displayResult,
                isAuth: req.session.isLoggedIn
            })
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
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