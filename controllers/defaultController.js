const Service = require('../models/service');
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

        return res.render('default/services', {
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
        return res.render('default/services-detail', {
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