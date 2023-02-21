const app = SpreadsheetApp
const ui = app.getUi()
const ss = app.getActiveSpreadsheet()

// Aba atual (mes)
const ssActive = ss.getActiveSheet()
// Aba dados Sigor
const sigorDB = ss.getSheetByName('dadosSigor')

// Localizando Coluna N° CNPJ
const ultimalinha = sigorDB.getLastRow()
const buscarNumeroCNPJ = sigorDB.getRange(1, 2, ultimalinha).getValues()

//--------------------------------//-------------------------------------//

// Gerando menu na planilha
function menuGeradorProposta() {
  const ui = SpreadsheetApp.getUi()
    .createMenu("SIGOR")
    .addItem("Efetuar login", "salveTokenSigor")
    .addItem("Gerar CDF", "requisicaoMTR")
    .addToUi()
}

//--------------------------------//-------------------------------------//

function requisicaoTokenSigor(cpf, senha, unidade) {

  const data = {
    'cpfCnpj': cpf,
    'senha': senha,
    'unidade': unidade
  };
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data),
  };

  const openUrl = UrlFetchApp.fetch(`https://mtrr.cetesb.sp.gov.br/apiws/rest/gettoken`, options);
  const getToken = openUrl.getContentText()

  const json = JSON.parse(getToken)
  const token = json.objetoResposta

  return token
}

//--------------------------------//-------------------------------------//

function salveTokenSigor() {

  // Caixa de diálogo para digitar n° CNPJ
  const box = ui.prompt("Gerar Token", "Digite o número de CNPJ", ui.ButtonSet.OK).getResponseText()

  // Localizando linha N° CNPJ
  const findClient = buscarNumeroCNPJ.findIndex(id => id == box) + 1
  const verifyBollean = buscarNumeroCNPJ.map(id => id == box).some(bollean => bollean)

  const getRazaoSocial = sigorDB.getRange(findClient, 3).getValue()

  if (!verifyBollean || box === '') {
    return ui.alert("Numero de CNPJ não existe ou vazio!")
  } else {
    ui.alert(`Cliente ${getRazaoSocial} logado com sucesso!!!`)
  }

  const getCpf = sigorDB.getRange(findClient, 4).getValue().toString()
  const getSenha = sigorDB.getRange(findClient, 5).getValue()
  const getUnidade = sigorDB.getRange(findClient, 6).getValue().toString()
  // const getvaleuBAREAER = sigorDB.getRange(findClient, 7).getValue()

  const getToken = requisicaoTokenSigor(getCpf, getSenha, getUnidade)
  const salveToken = sigorDB.getRange(findClient, 7).setValue(getToken)
  Logger.log(getToken)

}

//--------------------------------//-------------------------------------//
function autoLoguinSigor () {
  const getCNPJ = ssActive.get

}


// Logger.log(requisicaoTokenSigor())
function requisicaoMTR() {
  
  

    const box = ui.prompt("Gerar certificado", "Digite o número do MTR", ui.ButtonSet.OK).getResponseText()


    // Localizando Coluna N° CNPJ
    const ultimalinhaAbaMes = ssActive.getLastRow()
    const buscarNumeroMtrAbaMes = ssActive.getRange(1, 9, ultimalinhaAbaMes).getValues()

    // Localizando linha N° CNPJ
    const findClientAbaMes = buscarNumeroMtrAbaMes.findIndex(id => id == box) + 1
    const verifyBolleanAbaMes = buscarNumeroMtrAbaMes.map(id => id == box).some(bollean => bollean)

    Logger.log(findClientAbaMes)


    const numeroMTR = ssActive.getRange(findClientAbaMes, 9).getValue()
    Logger.log(numeroMTR)

    const findCNPJ = ssActive.getRange(findClientAbaMes, 2).getValue()
    const findToken = buscarNumeroCNPJ.findIndex(id => id == findCNPJ) + 1
    Logger.log(findCNPJ)

    const getToken = sigorDB.getRange(findToken, 7).getValue()

    // Logger.log(findToken)
    Logger.log(getToken)
    if (!verifyBolleanAbaMes || box === '') {
      return ui.alert("Numero de MTR não existe ou vazio!")
    } else {
      ui.alert(`CDF solicitado com sucesso!!!`)
    }

    const options = {
      'headers': { 'Authorization': getToken },
    }

    const openUrlListaClasse = UrlFetchApp.fetch(`https://mtrr.cetesb.sp.gov.br/apiws/rest/retornaManifesto/${numeroMTR}`, options).getContentText()
  
    const statusCdf = JSON.parse(openUrlListaClasse).objetoResposta.situacaoManifesto.simDescricao
    const numeroCdf = JSON.parse(openUrlListaClasse).objetoResposta.cdfCodigo

    Logger.log(numeroCdf)
    Logger.log(statusCdf)
    if (numeroCdf == null) {
      ssActive.getRange(findClientAbaMes, 18).setValue(`${statusCdf}`)
    
    } else {
      ssActive.getRange(findClientAbaMes, 18).setValue(`${numeroCdf}`)

    }
  
}


//--------------------------------//-------------------------------------//

function dodownloadCertificado () {


const data = {
    'cpfCnpj': "06619566871" ,
    'senha': "rq@sigor2021",
    'unidade': 55597
  }

  const getCdfNumber = 925505
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': { 'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1NTU5Nyw4MDM0OSIsInJvbGUiOjEsImV4cCI6MTY3NTAzMDc0N30.lNHqio_eYoDNwGNSM6LHg8HHkNipcfFZOuvdb8mEQRsR01C41ONcd_n2OQofG4iqjZfoICpGsRlVDG6xW4GPtg` },
    'payload': JSON.stringify(data)
  }

  const gerarCdf = UrlFetchApp.fetch(`https://mtrr.cetesb.sp.gov.br/apiws/rest/downloadCertificado/${getCdfNumber}`, options)
  const pdfBlob = gerarCdf.getBlob()
  DriveApp.createFile(pdfBlob)

  
Logger.log(gerarCdf)

}
//testeeeee
// {parceiroTransportador={parCodigo=583.0, parDescricao=SILCON AMBIENTAL LTDA, parCnpj=50856251000221}, listaManifestoResiduo=[{tipoAcondicionamento={tiaDescricao=SACO PLÁSTICO, tiaCodigoReferencia=14.0, tiaCodigo=2.0}, marNumeroONU=null, residuo={resCodigoIbama=Grupo A, resCodigo=719.0, resDescricao=Resíduos de Serviços de Saúde classificados como Grupos A1, A2, A3, A4 ou A5, conforme ANVISA RDC 222/2018 - Contempla os resíduos códigos 180101(*), 180102(*), 180103(*), 180104(*), 180105(*),  180106(*), 180107(*), 180108(*), 180109(*), 180110(*), 180111(*), 180112(*), 180113(*), 180114(*) e 180115(*) conforme IBAMA 13/2012}, marClasseRisco=null, unidade={uniCodigo=3.0, uniSigla=TON, uniDescricao=Tonelada}, marObservacao=null, classe={claDescricao=GRUPO A (RSS), claCodigo=41.0}, grupoEmbalagem={greCodigo=3.0, greDescricao=III}, marQuantidade=0.001, tratamento={traCodigo=25.0, traDescricao=Autoclave}, marQuantidadeRecebida=0.0038, marDensidade=null, tipoEstado={tieCodigoReferencia=1.0, tieCodigo=4.0, tieDescricao=SOLIDO}, marJustificativa=CONFORME FATURAMENTO, marNomeEmbarque=Substância que apresenta risco para o meio ambiente, sólida N.E.}], parceiroArmazenadorTemporario={parCnpj=null, parDescricao=, parCodigo=null}, parceiroGerador={parCodigo=54809.0, parDescricao=M.M. DE LIMA PUTUMUJU PET SHOP, parCnpj=21859804000110}, manObservacao=null, manData=1.651493887297E12, manNumero=220001069803, manPlacaVeiculo=QXY2C12, situacaoManifesto={simOrdem=3.0, simDescricao=Recebido, simCodigo=3.0}, manNumeroEstadual=null, cdfCodigo=829924, manNomeMotorista=PEDRO, estado={estAbreviacao=SP, estCodigo=26.0}, manDataExpedicao=null, manResponsavel=Maurilia mariana de lima putumuju, parceiroDestinador={parCodigo=583.0, parDescricao=SILCON AMBIENTAL LTDA, parCnpj=50856251000221}, manJustificativaCancelamento=}
