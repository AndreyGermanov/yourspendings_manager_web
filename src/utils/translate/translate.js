import dict from './lang/en.js'

/**
 * Method used to translate string to different language, depending on connected language from file in line above
 * @param text string Original string to translate
 * @returns string Translated String (or original string if no translation available)
 */
export default function translate(text) {
    if (typeof(dict[text])!=='undefined' && dict[text]) {
        return dict[text]
    } else {
        return text
    }
}