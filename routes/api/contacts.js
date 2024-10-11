const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.json({ message: 'Homework done!' })
})

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: "Homework done!" });
})

router.post('/', async (req, res, next) => {
  res.json({ message: "Homework done!" });
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: "Homework done!" });
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: "Homework done!" });
})

module.exports = router
