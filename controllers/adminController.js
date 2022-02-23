const Service = require('../models/service')
exports.getIndex = (req, res, next) => {
    res.render('admin/dashboard', {
        pageTitle: 'Admin',
        path: '/'
    })
}

exports.getCreateService = (req, res, next) => {
    res.render('admin/services/create-service', {
        pageTitle: 'Create Service',
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
        console.log(result);
        console.log('Service Created');
        return res.redirect('/admin/dashboard');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}