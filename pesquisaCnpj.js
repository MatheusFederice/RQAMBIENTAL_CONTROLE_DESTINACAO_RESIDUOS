//Pesquisa CNPJ sagui
// function myFunction() {

// const requestApi = (cnpj) => {

// var url = `https://receitaws.com.br/v1/cnpj/${cnpj}`

// var response = UrlFetchApp.fetch(url);
// var json =  response.getContentText();
// var data = JSON.parse(json);

// const { nome, municipio } = data;


// Logger.log(municipio);
// Logger.log(nome);

// };

// requestApi(27865757000102)

// };

//--------------------------------------------------------------------------------------

// //Pesquisa CNPJ eu
// function testando (cnpj) {
//   //const cnpj = 27865757000102
//   const url = `https://receitaws.com.br/v1/cnpj/${cnpj}`
//   const open = UrlFetchApp.fetch(url)
//   const json = open.getContentText()
//   const data = JSON.parse(json);

//   const { nome, municipio } = data

//   return data
// }
// // Logger.log(testando(27865757000102))

//--------------------------------------------------------------------------------------
// //Joga informações CNPJ na planilha google
// function spreadSheet () {
//   const apps = SpreadsheetApp.getActiveSheet()
//   const line = apps.getRange(1,1).getValue()
//   const pesquisa = testando(line)
//   const endereco = pesquisa
//   const setline = apps.getRange (1,2).setValue(endereco)


// Logger.log(line)
// }

//--------------------------------------------------------------------------------------
