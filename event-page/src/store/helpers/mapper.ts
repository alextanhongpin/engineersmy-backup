// mapper.js is a script that performs data mapping
import * as moment from 'moment'

export default {
  mapDate (value): string {
    return moment(value).format('Do, ddd')
  },
  mapMonth (value): string {
    return moment(value).format('MMMM')
  },
  mapYear (value): string {
    return moment(value).format('YYYY')
  },
  mapIsToday (value): boolean {
    return new Date(value).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
  },
  mapReadableDate (value: number): string {
    return moment(value).calendar()
  },
  mapFormatDate (value): string {
    return moment(value || new Date()).calendar()
  },
  mapStandardDate (value): string {
    return moment(value).format('Do MMM YYYY')
  },
  mapIsExpired (value): boolean {
    return new Date(value).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)
  },
  mapStringToArray (str): string[] {
    const arr = str.split(',') // Split by commas
      .map(s => s.trim()) // Trim spaces
      .filter(nonNull => nonNull) // Remove empty values
      .map(s => s.toLowerCase()) // Convert to lowercase characters

    let set:Set<string> = new Set(arr)
    const unique = Array.from(set) // Take only unique values
    return unique
  },
  mapDateToUTC (date: Date): string {
    const utcString = new Date(date ? date : new Date()).toUTCString()
    // const utcTimestamp = new Date(utcString).getTime()
    return moment.utc(utcString).format()
  },
  mapBackgroundImage (src: String): any {
    return {
      background: `url(${src}) no-repeat center center / cover`
    }
  },
  mapBackgroundImageContain (src: String): any {
    return {
      background: `url(${src}) no-repeat center center / contain`
    }
  },
  mapElementInViewport (el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    )
  }
}

