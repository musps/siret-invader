module.exports.parseExecutionTime = function parseExecutionTime(hrstart) {
  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
}

module.exports.modelObject = function modelObject(dataArr) {
  const modelObj = {
    siren: null,
    nic: null,
    siret: null,
    statutdiffusionetablissement: null,
    datecreationetablissement: null,
    trancheeffectifsetablissement: null,
    anneeeffectifsetablissement: null,
    activiteprincipaleregistremetiersetablissement: null,
    to_char: null,
    etablissementsiege: null,
    nombreperiodesetablissement: null,
    complementadresseetablissement: null,
    numerovoieetablissement: null,
    indicerepetitionetablissement: null,
    typevoieetablissement: null,
    libellevoieetablissement: null,
    codepostaletablissement: null,
    libellecommuneetablissement: null,
    libellecommuneetrangeretablissement: null,
    distributionspecialeetablissement: null,
    codecommuneetablissement: null,
    codecedexetablissement: null,
    libellecedexetablissement: null,
    codepaysetrangeretablissement: null,
    libellepaysetrangeretablissement: null,
    complementadresse2etablissement: null,
    numerovoie2etablissement: null,
    indicerepetition2etablissement: null,
    typevoie2etablissement: null,
    libellevoie2etablissement: null,
    codepostal2etablissement: null,
    libellecommune2etablissement: null,
    libellecommuneetranger2etablissement: null,
    distributionspeciale2etablissement: null,
    codecommune2etablissement: null,
    codecedex2etablissement: null,
    libellecedex2etablissement: null,
    codepaysetranger2etablissement: null,
    libellepaysetranger2etablissement: null,
    datedebut: null,
    etatadministratifetablissement: null,
    enseigne1etablissement: null,
    enseigne2etablissement: null,
    enseigne3etablissement: null,
    denominationusuelleetablissement: null,
    activiteprincipaleetablissement: null,
    nomenclatureactiviteprincipaleetablissement: null,
    caractereemployeuretablissement: null
  }
  Object.keys(modelObj).map((field, i) => (modelObj[field] = dataArr[i] || null))

  return modelObj
}

