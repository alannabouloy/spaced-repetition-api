const { LinkedList } = require("../linked-list/LinkedList");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getNextWord(db, word_id) {
    return db
    .from('word')
    .select(
      'original',
      'correct_count',
      'incorrect_count'
    )
    .where('id', word_id)
    .first()
  },

  getHead(db, language_id){
    return db
    .from('language')
    .join('word', 'word.language_id', '=', 'language.id')
    .select('head')
    .where({language_id})
  },

  checkGuess(db, language_id){
    return db
      .from('word')
      .join('language', 'word.id', '=', 'language.head')
      .select('*')
      .where({language_id});
  },

  generateLinkedList(words, head){
    const currHead = words.find(word => word.id === head)
    const headIndex = words.indexOf(currHead)
    const headNode = words.splice(headIndex, 1)
    const list = new LinkedList()
    list.insertLast(headNode[0])

    let nextIndex = headNode[0].next;
    let currWord = words.find(word => word.id === nextIndex)
    list.insertLast(currWord)
    nextIndex = currWord.next
    currWord = words.find(word => word.id === nextIndex)

    while(currWord !== null){
      list.insertLast(currWord)
      nextIndex = currWord.next
      if(nextIndex === null){
        currWord = null
      } else {
        currWord = words.find(word => word.id === nextIndex)
      }
    }

    return list
  },

  updateTables(db, words, language_id, total_score){
    return db.transaction(async (trx) => {
      return Promise.all([
        trx('language')
          .where({id: language_id})
          .update({ head: words[0].id, total_score}),
          ...words.map((word, i) => {
            if(i + 1 >= words.length){
              word.next = null;
            } else {
              word.next = words[i + 1].id;
            }
            return trx('word')
              .where({ id: word.id})
              .update({...word})
          })
      ])
    })
  }


}

module.exports = LanguageService
