const express = require('express')
const Student = require('../models/Student')
const router = express.Router()

router.get('/', async (req, res) => {
    const students =  await Student.find()
    res.json({data: students.map(student => formatResponseData('students', student.toObject()))})
})
router.post('/', async (req, res) => {
    let attributes = req.body.data.attributes 
    delete attributes._id 
    let newStudent = new Student(attributes)
    await newStudent.save()
    res.status(201).json({data: formatResponseData('people', newStudent.toObject())})
})
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        if(!student) {
            throw new Error('Resource not found')
        }
    res.json({data: formatResponseData('people', student.toObject())})
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