export default function useUtilities() {
    const slugify = (str: string) => {
        str = str.replace(/^\s+|\s+$/g, '')
        str = str.toLowerCase()

        const from =
            'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
        const to =
            'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------'
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        }

        str = str
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
        return str
    }

    function upperCaseFirstLetter(str: string): string {
        const firstLetter = str.slice(0, 1)
        return firstLetter.toUpperCase() + str.substring(1)
    }

    const removeDuplicates = (arr) => [...new Set(arr)]

    const sortBy = (arr, key) =>
        arr.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))

    const pluck = (objs, key) => objs.map((obj) => obj[key])

    return {
        slugify,
        upperCaseFirstLetter,
        removeDuplicates,
        sortBy,
        pluck,
    }
}
