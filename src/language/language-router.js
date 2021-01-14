const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const word = await LanguageService.getNextWord(
        req.app.get('db'),
        req.language.head
      )
      
      res.json({
        'nextWord': word.original,
        'wordCorrectCount': word.correct_count,
        'wordIncorrectCount': word.incorrect_count,
        'totalScore': req.language.total_score
      })
      next()
    } catch(error){
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    try{
      const { guess } = req.body
      if(!guess) {
        return res
          .status(400)
          .json({ error: `Missing 'guess' in request body`})
      } 
      next()
    } catch(error){
      next(error)
    }
  })

module.exports = languageRouter
