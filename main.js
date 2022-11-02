const API_URL =
  'https://sheet.best/api/sheets/4b800725-403b-432f-852a-e1ae08750dfc'

const JSON_PATH = './data.json'

const $$ = (e) => document.querySelectorAll(e)

const rand = (size) => Math.floor(Math.random() * size)

;(() => {
  fetch(JSON_PATH)
    .then((data) => data.json())
    .then((json) => sessionStorage.setItem('dataSize', json.length))
})()

const dataSize = sessionStorage.getItem('dataSize')

const getRandomQuestion = () => {
  return fetch(JSON_PATH)
    .then((res) => res.json())
    .then((json) => json[rand(dataSize)])
    .catch((err) => console.log(err))
}

const getAnswers = (concepto) => {
  return fetch(JSON_PATH)
    .then((res) => res.json())
    .then((json) => json.filter((e) => e['concepto'] === concepto))
}

$$('#gen-preg')[0].addEventListener('click', async () => {
  getRandomQuestion().then((data) => {
    let { rama, asignatura, concepto } = data
    sessionStorage.setItem('concepto', concepto)

    $$('div>ul')[0].innerHTML = ''

    let preg = document.createElement('li')
    preg.classList.add('list-group-item', 'list-group-item-primary')
    let area = document.createElement('small')
    area.style.fontSize = '0.55em'
    let definicion = document.createElement('h3')
    area.innerHTML = rama + ' - ' + asignatura
    definicion.innerHTML = concepto.replaceAll('\n', '<br>')
    preg.append(area, definicion)
    $$('div>ul')[0].append(preg)
  })
})

$$('#gen-res')[0].addEventListener('click', () => {
  let concepto = sessionStorage.getItem('concepto')
  if (!concepto) return
  sessionStorage.removeItem('concepto')

  getAnswers(concepto).then((data) => {
    data.forEach((e) => {
      let definicion = e['definicion']
      let res = document.createElement('li')
      res.classList.add('list-group-item', 'list-group-item-success')
      res.innerHTML = definicion.replaceAll('\n', '<br>')
      $$('div>ul')[0].append(res)
    })
  })
})
