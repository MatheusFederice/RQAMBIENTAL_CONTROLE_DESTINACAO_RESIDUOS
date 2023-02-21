function menuLancamento () {
  ui.createMenu('Controle de Coletas')
  .addItem('Lançamento de coleta', 'formLancamento')
  .addToUi()
}
// }

function formLancamento () {
  const html = HtmlService.createHtmlOutputFromFile('Lançamento Coleta')
  // const showHtml = html.evaluate()
  ui.showModelessDialog(html,"Lançamento de Coleta")
  }

// function openDialog() {
//   var html = HtmlService.createHtmlOutputFromFile('Index');
//   SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
//       .showModalDialog(html, 'Dialog title');
// }