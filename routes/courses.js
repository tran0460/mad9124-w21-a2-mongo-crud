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
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        if(!course) {
            throw new Error('Resource not found')
        }
    res.json({data: formatResponseData('courses', course.toObject())})
    }
    catch (error) {
        sendResourceNotFound(req, res)
    }
})
function formatResponseData(type, resource) {
    const {_id, ...attributes} = resource
    return {type, id: _id, attributes}
}
function sendResourceNotFound(req, res) {
    res.status(404).json({
        errors: [
        {
            status: '404',
            title: 'Resource does not exist',
        }
        ]
    })
}
module.exports = router