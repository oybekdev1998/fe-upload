function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) {
    return '0 Byte'
  }
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}


function noop(){}

export function upload(selector, options = {}) {

  function createEl(tag, className = [], content) {
    const node = document.createElement(tag)
    if(className.length) {
      node.classList.add(...className)
    }
    if(content) {
      node.textContent = content
    }

    return node

  }

  let files = []
  const input = document.querySelector(selector)
  const onUpload = options.onUpload ?? noop

  const preview = createEl('div', ['preview'])
  const open = createEl('button', ['btn'], 'Открыть')
  const upload = createEl('button', ['btn', 'btn-pramery'], 'Загрузить')

  upload.style.display = 'none'
  if (options.multi) {
    input.setAttribute('multiple', true)
  }
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', upload)
  input.insertAdjacentElement('afterend', open)


  const triggerInput = () => input.click()

  const changeHandler = event => {
    if(!event.target.files.length) {
      return
    }

    files = Array.from(event.target.files)

    preview.innerHTML = ''

    upload.style.display = 'inline'

    files.forEach(file => {
      if(!file.type.match('image')) {
        return
      }

      const reader = new FileReader()
      reader.onload = event => {
        const src = event.target.result
        preview.insertAdjacentHTML("afterbegin", `  
          <div class="preview-image">
            <div class="remove" data-name="${file.name}">&times</div>
            <img src="${src}">
            <div class="preview-info">
              <span>${file.name}</span>
              <span>${bytesToSize(file.size)}</span>
            </div>
          </div>
        `)
      }

      reader.readAsDataURL(file)

    })
  }
  const removeHandler = event => {
    if(!event.target.dataset.name) {
      return
    }
    const {name} = event.target.dataset
    files = files.filter(file => file.name !==  name)

    if(!files.length) {
      upload.style.display = 'none'
    }

    const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')
    block.classList.add('removing')
    setTimeout( () => block.remove(), 300)


  }

  const clearPreview = el => {
    el.style.bottom = '4px'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.remove').forEach(item => item.remove())

    const previewInfo = document.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview)
    onUpload(files, previewInfo)
  }


  input.addEventListener('change', changeHandler)
  open.addEventListener('click', triggerInput)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}