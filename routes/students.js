const express = require('express')
const Student = require('../models/Student')
const router = express.Router()

router.get('/', async (req, res) => {
    const students =  await Student.find()
    res.json({data: students.map(student => formatResponseData('students', student.toObject()))})
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