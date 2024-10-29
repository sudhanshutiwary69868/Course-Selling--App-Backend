import {rateLimit} from 'express-rate-limit'

const limiter=rateLimit({
  windowMs:1000,
  limit:5,
  standardHeaders:'draft-7',
  legacyHeaders:false

})

module.exports={
  limiter
}