export const formsReducer = (allForms, action) => {
  const { type, data } = action
  switch (type) {
    case 'add':
      return [...allForms, data]
    case 'remove': {
      allForms.splice(data, 1)
      return [...allForms]
    }
    case 'update': {
      const tmpForms = []
      allForms.map(form => {
        if (form.formID === data.formID) {
          tmpForms.push({ ...form, ...data })
        } else {
          tmpForms.push(form)
        }
      })
      return tmpForms
    }
    case 'set': {
      return data || []
    }
    default:
      return allForms
  }
}
export const reportsReducer = (reports, action) => {
  const { type, report, reportID, rport } = action
  switch (type) {
    case 'add':
      return [...reports, report]
    case 'remove': {
      reports.splice(rport, 1)
      return [...reports]
    }
    case 'update': {
      const oldReports = [...reports]
      oldReports[reportID] = report
      return [...oldReports]
    }
    case 'set': {
      return reports || []
    }
    default:
      return reports
  }
}
