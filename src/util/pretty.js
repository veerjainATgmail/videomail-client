const DASH = '- '
const SEPARATOR = '<br/>' + DASH

const stringify = function (anything) {
  return JSON.stringify(anything, 0, '<br/>')
}

function arrayToString (array) {
  if (array.length > 0) {
    const lines = []

    array.forEach(function (element) {
      if (element) {
        try {
          lines.push(stringify(element))
        } catch (exc) {
          lines.push(element.toString() + ': unable to stringify it because of: ' + exc.toString())
        }
      }
    })

    return DASH + lines.join(SEPARATOR)
  }
}

function objectToString (object, options) {
  const propertyNames = Object.getOwnPropertyNames(object)
  const excludes = (options && options.excludes) || []
  const lines = []
  var sLines

  // always ignore these
  excludes.push('stack')

  if (propertyNames.length > 0) {
    var exclude = false

    propertyNames.forEach(function (name) {
      if (excludes) {
        exclude = excludes.indexOf(name) >= 0
      }

      if (!exclude) {
        // this to cover this problem:
        // https://github.com/binarykitchen/videomail-client/issues/157
        try {
          if (object[name]) {
            const line = stringify(object[name])
            lines.push(line)
          }
        } catch (exc) {
          switch (name.toString().toLowerCase()) {
            case 'callee':
            case 'caller':
            case 'arguments':
              // skip some known we can't use on older browsers
              break
            default:
              lines.push(name + ': unable to stringify it because of: ' + exc.toString())
              break
          }
        }
      }
    })
  }

  if (lines.length === 1) {
    sLines = lines.join()
  } else if (lines.length > 1) {
    sLines = DASH + lines.join(SEPARATOR)
  }

  return sLines
}

export default function (anything, options) {
  if (anything === null) {
    return 'null'
  } else if (typeof anything === 'undefined') {
    return 'undefined'
  } else if (typeof anything === 'string') {
    return anything
  } else if (Array.isArray(anything)) {
    return arrayToString(anything)
  } else if (typeof anything === 'object') {
    return objectToString(anything, options)
  } else {
    return anything.toString()
  }
}
