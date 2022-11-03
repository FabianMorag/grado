const API_URL =
  'https://sheet.best/api/sheets/4b800725-403b-432f-852a-e1ae08750dfc'

const JSON_PATH = 'data.json'

const $ = (e) => document.querySelectorAll(e)

const rand = (size) => Math.floor(Math.random() * size)

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
}

const getAllQuestions = () => {
  return fetch(JSON_PATH)
    .then((res) => res.json())
    .then((json) => json)
}

const div = document.createElement('div')
div.setAttribute('class', 'accordion accordion-flush')
div.setAttribute('id', 'accordionFlushExample')
document.body.append(div)

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
  button.textContent = index + '. ' + concepto
  header.append(button)
  divItem.append(header)

  let collapse = document.createElement('div')
  collapse.setAttribute('class', 'accordion-collapse collapse')
  collapse.setAttribute('id', 'flush-collapse' + id)
  collapse.setAttribute('aria-labelledby', 'flush-heading' + id)
  collapse.setAttribute('data-bs-parent', '#accordionFlushExample')
  let body = document.createElement('div')
  body.setAttribute('class', 'accordion-body')
  body.textContent = definicion
  collapse.append(body)
  divItem.append(collapse)

  return divItem
}

$('#gen-preg')[0].addEventListener('click', async () => {
  $('div>ul')[0].innerHTML = ''
  $('.accordion').innerHTML = ''

  getRandomQuestion().then((data) => {
    let { rama, asignatura, concepto } = data
    sessionStorage.setItem('concepto', concepto)

    let preg = document.createElement('li')
    preg.classList.add('list-group-item', 'list-group-item-primary')
    let area = document.createElement('small')
    let definicion = document.createElement('h3')
    area.textContent = rama + ' - ' + asignatura
    definicion.innerHTML = concepto.replaceAll('\n', '<br>')
    preg.append(area, definicion)
    $('div>ul')[0].append(preg)
  })
})

$('#gen-res')[0].addEventListener('click', () => {
  let concepto = sessionStorage.getItem('concepto')
  if (!concepto) return
  sessionStorage.removeItem('concepto')

  getAnswers(concepto).then((data) => {
    data.forEach((e) => {
      let definicion = e['definicion']
      let res = document.createElement('li')
      res.classList.add('list-group-item', 'list-group-item-success')
      res.innerHTML = definicion.replaceAll('\n', '<br>')
      $('div>ul')[0].append(res)
    })
  })
})

$('#gen-todas')[0].addEventListener('click', () => {
  $('div>ul')[0].innerHTML = ''
  sessionStorage.removeItem('concepto')
  if ($('.accordion')[0].innerHTML !== '') return

  getAllQuestions().then((data) => {
    data.forEach((e, i) =>
      $('.accordion')[0].append(createCollapsable(e, i + 1))
    )
  })
})
