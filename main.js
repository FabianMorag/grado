const $$ = (e) => document.querySelectorAll(e)

const rand = (size) => Math.floor(Math.random() * size)

const getData = () => {
  return fetch('./data.json')
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

$$('.gen-preg')[0].addEventListener('click', async () => {
  const data = await getData()
  let areasKeys = Object.keys(data)
  let area = areasKeys[rand(areasKeys.length)]

  let ramos = data[area]
  let ramosKeys = Object.keys(ramos)
  let ramo = ramosKeys[rand(ramosKeys.length)]

  let preguntas = ramos[ramo]
  let preguntasKeys = Object.keys(preguntas)
  let pregunta = preguntasKeys[rand(preguntasKeys.length)]
  let respuesta = preguntas[pregunta].replaceAll('\n', '<br>')

  let preg = document.createElement('li')
  preg.classList.add('list-group-item', 'list-group-item-primary')
  preg.textContent = pregunta

  sessionStorage.setItem('respuesta', respuesta)

  $$('div>ul')[0].innerHTML = ''
  $$('div>ul')[0].append(preg)
})

$$('.gen-res')[0].addEventListener('click', () => {
  let respuesta = sessionStorage.getItem('respuesta')
  if (!respuesta) return
  sessionStorage.clear()
  respuesta.forEach((e) => {
    let res = document.createElement('li')
    res.classList.add('list-group-item', 'list-group-item-success')
    res.innerHTML = e
    $$('div>ul')[0].append(res)
  })
})
