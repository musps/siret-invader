const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  siren: {
    type: 'String'
  },
  nic: {
    type: 'String'
  },
  siret: {
    type: 'String'
  },
  statutdiffusionetablissement: {
    type: 'String'
  },
  datecreationetablissement: {
    type: 'String'
  },
  trancheeffectifsetablissement: {
    type: 'String'
  },
  anneeeffectifsetablissement: {
    type: 'String'
  },
  activiteprincipaleregistremetiersetablissement: {
    type: 'String'
  },
  to_char: {
    type: 'String'
  },
  etablissementsiege: {
    type: 'String'
  },
  nombreperiodesetablissement: {
    type: 'String'
  },
  complementadresseetablissement: {
    type: 'String'
  },
  numerovoieetablissement: {
    type: 'String'
  },
  indicerepetitionetablissement: {
    type: 'String'
  },
  typevoieetablissement: {
    type: 'String'
  },
  libellevoieetablissement: {
    type: 'String'
  },
  codepostaletablissement: {
    type: 'String'
  },
  libellecommuneetablissement: {
    type: 'String'
  },
  libellecommuneetrangeretablissement: {
    type: 'String'
  },
  distributionspecialeetablissement: {
    type: 'String'
  },
  codecommuneetablissement: {
    type: 'String'
  },
  codecedexetablissement: {
    type: 'String'
  },
  libellecedexetablissement: {
    type: 'String'
  },
  codepaysetrangeretablissement: {
    type: 'String'
  },
  libellepaysetrangeretablissement: {
    type: 'String'
  },
  complementadresse2etablissement: {
    type: 'String'
  },
  numerovoie2etablissement: {
    type: 'String'
  },
  indicerepetition2etablissement: {
    type: 'String'
  },
  typevoie2etablissement: {
    type: 'String'
  },
  libellevoie2etablissement: {
    type: 'String'
  },
  codepostal2etablissement: {
    type: 'String'
  },
  libellecommune2etablissement: {
    type: 'String'
  },
  libellecommuneetranger2etablissement: {
    type: 'String'
  },
  distributionspeciale2etablissement: {
    type: 'String'
  },
  codecommune2etablissement: {
    type: 'String'
  },
  codecedex2etablissement: {
    type: 'String'
  },
  libellecedex2etablissement: {
    type: 'String'
  },
  codepaysetranger2etablissement: {
    type: 'String'
  },
  libellepaysetranger2etablissement: {
    type: 'String'
  },
  datedebut: {
    type: 'String'
  },
  etatadministratifetablissement: {
    type: 'String'
  },
  enseigne1etablissement: {
    type: 'String'
  },
  enseigne2etablissement: {
    type: 'String'
  },
  enseigne3etablissement: {
    type: 'String'
  },
  denominationusuelleetablissement: {
    type: 'String'
  },
  activiteprincipaleetablissement: {
    type: 'String'
  },
  nomenclatureactiviteprincipaleetablissement: {
    type: 'String'
  },
  caractereemployeuretablissement: {
    type: 'String'
  }
}, {
  versionKey: false
})

module.exports = mongoose.model('oks', schema)
