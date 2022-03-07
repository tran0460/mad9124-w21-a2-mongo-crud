const xss = require('xss')

const sanitize = sourceString => {
    return xss(sourceString, {
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    })
}

const stripTags = payload => {
    let attributes = { ...payload } // don't mutate the source data
    for (let key in attributes) {
    if (attributes[key] instanceof Array) {
        attributes[key] = attributes[key].map(element => {
        return typeof element === 'string'
          ? sanitize(element) // if true
          : stripTags(element) // if false
        })
    } else if (attributes[key] instanceof Object) {
        attributes[key] = stripTags(attributes[key])
    } else {
        attributes[key] = sanitize(attributes[key])
    }
    }
    return attributes
}

module.exports = (req, res, next) => {
    const { id, _id, ...attributes } = req.body
    const sanitizedBody = stripTags(attributes)
    req.body = sanitizedBody
    next()
}