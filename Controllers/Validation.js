const Joi = require('joi');

const categorySchema = Joi.object({
    catid: Joi.string().required(),
    catname: Joi.string().min(3).max(30).required(),
    startdate: Joi.date().required(),
});

const subCategorySchema = Joi.object({
    catid: Joi.string().required(),
    sub_catid: Joi.string().required(),
    subcat_name: Joi.string().min(3).max(30).required(),
    addedon: Joi.date().required(),
});

const validateCategory = (data) => {
    return categorySchema.validate(data);
};

const validateSubCategory = (data) => {
    return subCategorySchema.validate(data);
};

module.exports = {
    validateCategory,
    validateSubCategory,
};
