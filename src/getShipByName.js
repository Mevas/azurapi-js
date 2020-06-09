import { isNumber, isString, replace } from 'lodash'
import getShipByChineseName from './getShipByChineseName'
import getShipByEnglishName from './getShipByEnglishName'
import getShipByKoreanName from './getShipByKoreanName'
import getShipByJapaneseName from './getShipByJapaneseName'

const isValid = (input) => input && (isNumber(input) || (isString(input)))

const getShipByName = (name) => {
    if (!isValid(name)) return undefined
    name = replace(name, /μ/g, 'µ')
    return getShipByChineseName(name)
        || getShipByEnglishName(name)
        || getShipByKoreanName(name)
        || getShipByJapaneseName(name)
        || undefined
}

export default getShipByName
export { getShipByName as getShipByName }