import '@/assets/icons/iconfont.js'
import '@/assets/icons/iconFill.js'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const allSvg = require.context('.', false, /\.svg$/)
requireAll(allSvg)
