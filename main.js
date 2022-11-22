import {
  getSearchedQuestion,
  getRandomQuestion,
  getAnswers,
  getAllQuestions,
} from './api.js'

const div = document.createElement('div')
div.className = 'accordion accordion-flush'
div.id = 'accordionFlushExample'
document.body.append(div)

const $ = (e) => document.querySelector(e)

const $input = $('input')
const $form = $('form')
const $genDefinition = $('#gen-definition')
const $genAnswer = $('#gen-answer')
const $genAll = $('#gen-all')
const $questionAnswer = $('.list-group')
const $accordion = $('.accordion')

$form.addEventListener('submit', async (e) => {
  e.preventDefault()
  let { value } = $input
  if (!value) return

  $questionAnswer.innerHTML = ''
  $accordion.innerHTML = ''

  sessionStorage.removeItem('concepto')

  getSearchedQuestion(value).then((data) => {
    data.forEach((e, i) => $accordion.append(createCollapsable(e, i + 1)))
  })
})

$genDefinition.addEventListener('click', async () => {
  $questionAnswer.innerHTML = ''
  $accordion.innerHTML = ''

  getRandomQuestion().then((data) => {
    let { rama, asignatura, concepto } = data
    sessionStorage.setItem('concepto', concepto)

    let preg = document.createElement('li')
    preg.className = 'list-group-item list-group-item-primary'

    let area = document.createElement('small')
    area.className = 'area'
    area.textContent = rama + ' - ' + asignatura

    let definicion = document.createElement('h4')
    definicion.innerHTML = concepto.replaceAll('\n', '<br>')

    preg.append(area, definicion)
    $questionAnswer.append(preg)
  })
})

$genAnswer.addEventListener('click', async () => {
  let concepto = sessionStorage.getItem('concepto')
  if (!concepto) return
  sessionStorage.removeItem('concepto')

  getAnswers(concepto).then((data) => {
    data.forEach((e) => {
      let definicion = e['definicion']

      let res = document.createElement('li')
      res.className = 'list-group-item list-group-item-success'
      res.innerHTML = definicion.replaceAll('\n', '<br>')

      $questionAnswer.append(res)
    })
  })
})

$genAll.addEventListener('click', async () => {
  $questionAnswer.innerHTML = ''
  $accordion.innerHTML = ''
  sessionStorage.removeItem('concepto')

  getAllQuestions().then((data) => {
    data.forEach((e, i) => $accordion.append(createCollapsable(e, i + 1)))
  })
})

const createCollapsable = (item, index) => {
  let { id, concepto, definicion } = item

  let divItem = document.createElement('div')
  divItem.setAttribute('class', 'accordion-item')

  let header = document.createElement('h2')
  header.setAttribute('class', 'accordion-header')

  let button = document.createElement('button')
  button.setAttribute('class', 'accordion-button collapsed')
  button.setAttribute('id', 'flush-heading' + id)
  button.setAttribute('type', 'button')
  button.setAttribute('data-bs-toggle', 'collapse')
  button.setAttribute('data-bs-target', '#flush-collapse' + id)
  button.setAttribute('aria-expanded', 'false')
  button.setAttribute('aria-controls', 'flush-collapse' + id)
  button.innerHTML = index + '. ' + concepto.replaceAll('\n', '<br>')
  header.append(button)
  divItem.append(header)

  let collapse = document.createElement('div')
  collapse.setAttribute('class', 'accordion-collapse collapse')
  collapse.setAttribute('id', 'flush-collapse' + id)
  collapse.setAttribute('aria-labelledby', 'flush-heading' + id)
  collapse.setAttribute('data-bs-parent', '#accordionFlushExample')
  let body = document.createElement('div')
  body.setAttribute('class', 'accordion-body')
  body.innerHTML = definicion ? definicion.replaceAll('\n', '<br>') : ''
  collapse.append(body)
  divItem.append(collapse)

  return divItem
}
