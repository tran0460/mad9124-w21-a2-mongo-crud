const express = require('express')
const Course = require('../models/Course')
const router = express.Router()

router.get('/', async (req, res) => {
    const courses =  await Course.find()
    res.json({data: courses.map(course => formatResponseData('courses', course.toObject()))})
})
router.post('/', async (req, res) => {
    let attributes = req.body.data.attributes // body -> data -> attributes
    delete attributes._id // Delete this if its there, people can do bad bad things >:(
    let newCourse = new Course(attributes)
    await newCourse.save()
    res.status(201).json({data: formatResponseData('courses', newCourse.toObject())})
})
function formatResponseData(type, resource) {
    const {_id, ...attributes} = resource
    return {type, id: _id, attributes}
}
module.exports = router