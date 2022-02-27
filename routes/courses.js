const express = require('express')
const Course = require('../models/Course')
const router = express.Router()

router.get('/', async (req, res) => {
    const cars =  await Car.find()
    res.json({data: cars.map(car => formatResponseData('cars', car.toObject()))})
    })