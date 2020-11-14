const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// api/auth/register
router.post('/register',
[
  check('email', 'email is NOT correct').isEmail(),
  check('password', 'the minimal length of the password is 6 symbols')
    .isLength({min: 6})
],
async(req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array(),
        message: 'During registration, received NOT correct data'
      })
    }

    const {email, password} = req.body

    const candidate = await User.findOne({ email: email })
    if(candidate) {
      return res.status(400).json({message: 'Such user is already exist'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email: email, password: hashedPassword })

    await user.save()

    res.status(201).json({message: 'User created!'})

  } catch(e){
    res.status(500).json({ message: 'Something wrong! Try again!' })
  }
})

// api/auth/login
router.post('/login', async(req, res) => {

})

module.exports = router