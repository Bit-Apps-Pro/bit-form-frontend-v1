import { useState } from 'react'

export default function usePseudo(cls) {
  const [pseudo, setpseudo] = useState('Default')
  const [pcls, setpcls] = useState(cls || '')

  const setPseudo = val => {
    setpseudo(val)
    if (val === 'Default') {
      setpcls(cls.replace(/:focus|:hover/g, ''))
    }
    if (val === 'On Mouse Over') {
      // class1, class2 ---> class1:hover, class2:hover
      if (cls.match(/,/g)) {
        const classes = cls.split(',')
        setpcls(`${classes.join(':hover,')}:hover`)
      } else {
        setpcls(`${cls}:hover`)
      }
    }
    if (val === 'On Focus') {
      // class1, class2 ---> class1:focus, class2:focus
      if (cls.match(/,/g)) {
        const classes = cls.split(',')
        setpcls(`${classes.join(':focus,')}:focus`)
      } else {
        setpcls(`${cls}:focus`)
      }
    }
  }

  return [pseudo, pcls, setPseudo]
}
