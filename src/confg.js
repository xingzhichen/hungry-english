const path = require('path')
const templatePath = path.resolve('./src/template.ejs');
const outputPatch = path.resolve('./dist/index.html')
module.exports = {
  "url": "http://hungry-english.com/collocation/",
  "cookieContent": "csrftoken=nJCbRs8Pw3ieUa4I6jpl5qFGpSF6SWLOIjsnxeaZvx34PCG2Z55ztcAaRNPXPVse; Hm_lvt_775907ca626681a3ab2ae0fdc6e52f64=1550927079,1551273056,1551274455,1551580403; Hm_lpvt_775907ca626681a3ab2ae0fdc6e52f64=1551580847",
  "delayTime": "1000",
  templatePath,
  outputPatch
}