const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { helpers } = require('../helpers/helpers')

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
    //get variables
    const language = req.language
    const { guess } = req.body
    let total_score = language.total_score

    //if no guess return 400
    if(!guess) {
      return res
        .status(400)
        .json({ error: `Missing 'guess' in request body`})
    } 

    try{
      //get words 
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        language.id
      )
      //get head
      const [{head}] = await LanguageService.getHead(req.app.get('db'), language.id)
      
      //make list
      const list = LanguageService.generateLinkedList(words, head)
      
      //get word to check guess
      const [checkGuess] = await LanguageService.checkGuess(req.app.get('db'), language.id)

      if(checkGuess.translation === guess){
        //if guess is correct, double memory value and add to counters
        let mValue = list.head.value.memory_value * 2
        list.head.value.memory_value = mValue
        list.head.value.correct_count++

        //send word further back in list

        const answer = list.sendBackM(mValue)

        //increase total
        total_score++

        //update table

        await LanguageService.updateTables(
          req.app.get('db'),
          helpers.makeArray(list),
          language.id,
          total_score
        )

        //send out response
        res
          .status(200)
          .json({
            nextWord: list.head.value.original,
            totalScore: total_score,
            wordCorrectCount: list.head.value.correct_count,
            wordIncorrectCount: list.head.value.incorrect_count,
            answer: answer.value.translation,
            isCorrect: true,
          })
      } else {
        //guess incorrectly set mValue to 1 and add to incorrect count
        list.head.value.memory_value = 1
        list.head.value.incorrect_count++

        //send back in list
        const answer = list.sendBackM(1)

        //update tables
        await LanguageService.updateTables(
          req.app.get('db'),
          helpers.makeArray(list),
          language.id,
          total_score
        )

        //send response
        res
          .status(200)
          .json({
            nextWord: list.head.value.original,
            totalScore: total_score,
            wordCorrectCount: list.head.value.correct_count,
            wordIncorrectCount: list.head.value.incorrect_count,
            answer: answer.value.translation,
            isCorrect: false,
          })
      }
      next()
    } catch(error){
      next(error)
    }
  })

module.exports = languageRouter
