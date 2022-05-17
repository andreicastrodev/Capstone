const Service = require('../models/service');
const Inquiry = require('../models/inquiry');
const Schedule = require('../models/schedule');
const User = require('../models/user');
const Vote = require('../models/vote');
const VoteData = require('../models/voteData');
const News = require('../models/news');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');
const twilio = require('twilio')
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'andreinichol.e.castro.dev@gmail.com',
            pass: 'plduujqdtidiefgw'

        }
    });


exports.getIndex = async (req, res, next) => {


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

exports.getCreateNews = (req, res, next) => {

    res.render('admin/news/create-news', {
        pageTitle: 'Create News',
        oldInput: {
            title: '',
            content: '',
        },
        path: '/'
    })
}

exports.getManageNews = async (req, res, next) => {



    try {
        const news = await News.find();
        console.log(news);

        return res.render('admin/news/manage-news', {
            pageTitle: 'Manage News',
            newsData: news,
            path: '/'
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}




exports.getEditNews = async (req, res, next) => {

    const newsId = req.params.newsId;

    try {
        const news = await News.findById(newsId);

        return res.render('admin/news/edit-news', {
            pageTitle: 'Edit News',
            news,
            path: '/'
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

}


exports.getCreateService = (req, res, next) => {

    res.render('admin/services/create-service', {
        pageTitle: 'Create Service',
        oldInput: {
            title: '',
            location: '',
            description: ""
        },
        path: '/'
    })
}

exports.getManageService = async (req, res, next) => {

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

    try {
        const users = await User.find();
        console.log(users);
        return res.render('admin/user/manage-user', {
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

exports.getManageVote = async (req, res, next) => {

    try {
        const voteData = await VoteData.find().populate('voteId');

        console.log(voteData);

        return res.render('admin/vote/manage-vote', {
            pageTitle: 'Manage Votes',
            voteData,
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


exports.postCreateNews = async (req, res, next) => {

    const title = req.body.title;
    const content = req.body.content;
    const date = new Date().toDateString();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/news/create-news', {
            pageTitle: 'Create News',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                title,
                content,
            },
            isAuth: req.session.isLoggedIn
        });
    }
    const news = new News({
        title,
        content,
        date
    })
    try {
        const results = await news.save();

        console.log(results);

        return res.redirect('/admin/manage-news');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postEditNews = async (req, res, next) => {
    const newsId = req.body.newsId
    const newTitle = req.body.title;
    const newContent = req.body.content;

    try {
        const news = await News.findById(newsId);
        news.title = newTitle;
        news.content = newContent;
        const result = await news.save();
        console.log(result)
        return res.redirect('/admin/manage-news');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postDeleteNews = async (req, res, next) => {
    const newsId = req.body.newsId;


    try {
        await News.deleteOne({ _id: newsId });
        console.log('news delete')
        return res.redirect('/admin/manage-news');

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/services/create-service', {
            pageTitle: 'Create Service',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                title,
                location,
                description
            },
            isAuth: req.session.isLoggedIn
        });
    }

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




exports.getCreateVote = (req, res, next) => {

    try {
        return res.render('admin/vote/create-vote', {
            pageTitle: 'Create Vote',
            oldInput: {
                title: '',
                choice1: '',
                choice2: '',
                choice3: "",
                description: ''
            },
            path: '',
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.getVoteHistory = async (req, res, next) => {
    try {
        const [votes] = await User.find()
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
        const userData = votes;
        console.log(userData);
        return res.render('admin/vote/vote-history', {
            pageTitle: 'Vote History',
            votes: voteData,
            userData,
            path: '/',
            isAuth: req.session.isLoggedIn
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}



exports.postCreateVote = async (req, res, next) => {
    const title = req.body.title;
    const choice1 = req.body.choice1;
    const choice2 = req.body.choice2;
    const choice3 = req.body.choice3;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/vote/create-vote', {
            pageTitle: 'Create Votes',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                title,
                choice1,
                choice2,
                choice3,
                description
            },
            isAuth: req.session.isLoggedIn
        });
    }
    const vote = new Vote({
        title,
        choices: [choice1, choice2, choice3],
        description,
        isClosed: false
    });
    try {
        const result = await vote.save();
        console.log('VOTE CREATED', result);
        return res.redirect('/admin/vote/manage-vote');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postDeleteInquiry = async (req, res, next) => {
    const inquiryId = req.body.inquiryId;
    try {
        const inquiry = await Inquiry.findById(inquiryId).populate('userId');
        const body = 'Your shedule has been cancelled, your inquiry cannot be processed at this moment.'



        const mailOptions = {
            to: inquiry.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'About your Inquiry',
            text: `Good day! ${body}`

        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)

            }
        })
        // mobile number can only be sent through an authorized mobile number because of trial account
        const client = new twilio('AC3cdf2008e2d3331e5527db84554fe00f', 'de6631d892aeae3c29a00d17a33d9bbd');
        client.messages.create({
            to: '+639166981247',
            from: "+16203128359",
            body: `Good Day! ${body}`
        })

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
        const body = 'We have read your concern about this certain topic, we will email/text you again if we confirmed it'
        // transporter.sendMail({
        //     to: inquiry.userId.email,
        //     from: 'andreinichol.e.castro.dev@gmail.com',
        //     subject: 'About your Inquiry',
        //     html: `
        //       <p>Good day!</p>
        //       <p>${body}</p>
        //     `
        // });

        const mailOptions = {
            to: inquiry.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'About your Inquiry',
            text: `Good day! ${body}`

        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)

            }
        })
        // mobile number can only be sent through an authorized mobile number because of trial account
        const client = new twilio('AC3cdf2008e2d3331e5527db84554fe00f', 'de6631d892aeae3c29a00d17a33d9bbd');
        client.messages.create({
            to: '+639166981247',
            from: "+16203128359",
            body: `Good Day! ${body}`
        })

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


        const body = `Your shedule has been approved,
         please view your schedule details on your schedule history at your profile,
         there will be a detailed overview invoice that you can read.
        `
        const mailOptions = {
            to: schedule.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'About your Schedule',
            text: `Good day! ${body}`

        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)

            }
        })
        // mobile number can only be sent through an authorized mobile number because of trial account
        const client = new twilio('AC3cdf2008e2d3331e5527db84554fe00f', 'de6631d892aeae3c29a00d17a33d9bbd');
        client.messages.create({
            to: '+639166981247',
            from: "+16203128359",
            body: `Good Day! ${body}`
        })

        return res.redirect('/admin/manage-schedule');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.postCancelSchedule = async (req, res, next) => {
    const scheduleId = req.body.scheduleId
    const body = 'Your shedule has been cancelled, your schedule cannot be processed because we are fully booked, please schedule on a different date.'
    try {
        const schedule = await Schedule.findById(scheduleId).populate('userId')
        schedule.status = 'Cancelled';
        await schedule.save();
        console.log('SCHEDULE Cancelled');



        const mailOptions = {
            to: schedule.userId.email,
            from: 'andreinichol.e.castro.dev@gmail.com',
            subject: 'About your Schedule',
            text: `Good day! ${body}`

        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)

            }
        })
        // mobile number can only be sent through an authorized mobile number because of trial account
        const client = new twilio('AC3cdf2008e2d3331e5527db84554fe00f', 'de6631d892aeae3c29a00d17a33d9bbd');
        client.messages.create({
            to: '+639166981247',
            from: "+16203128359",
            body: `Good Day! ${body}`
        })

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



exports.postViewVote = async (req, res, next) => {
    const voteDataId = req.body.voteDataId
    const [voteData] = await VoteData.find(mongoose.Types.ObjectId(voteDataId)).populate('voteId');
    console.log(voteData)
    return res.render('default/vote/vote-results', {
        pageTitle: 'Vote Results',
        path: '/',
        voteResults: voteData,
        isAuth: req.session.isLoggedIn
    })
}

exports.postCloseVote = async (req, res, next) => {
    const voteId = req.body.voteId;


    try {
        const vote = await Vote.findById(voteId);

        console.log(vote);

        vote.isClosed = true;
        await vote.save();
        return res.redirect('/admin/manage-vote')
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }

}