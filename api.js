export { getQuestion, getRandomQuestion, getAnswers, getAllQuestions }

const API_URL =
  'https://sheet.best/api/sheets/4b800725-403b-432f-852a-e1ae08750dfc'

const JSON_PATH = 'data.json'

const rand = (size) => Math.floor(Math.random() * size)

function removeAccentsAndCase(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const getQuestion = (input) => {
  return fetch(JSON_PATH)
    .then((data) => data.json())
    .then((json) =>
      json.filter(
        (e) =>
          removeAccentsAndCase(e['concepto']).includes(
            removeAccentsAndCase(input)
          ) ||
          removeAccentsAndCase(e['definicion']).includes(
            removeAccentsAndCase(input)
          )
      )
    )
}

const getRandomQuestion = () => {
  return fetch(JSON_PATH)
    .then((res) => res.json())
    .then((json) => json[rand(json.length)])
    .catch((err) => console.log(err))
}

const getAnswers = (concepto) => {
  return fetch(JSON_PATH)
    .then((res) => res.json())
    .then((json) => json.filter((e) => e['concepto'] === concepto))
    .catch((err) => console.log(err))
}

const getAllQuestions = () => {
  return fetch(JSON_PATH)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => console.log(err))
}
