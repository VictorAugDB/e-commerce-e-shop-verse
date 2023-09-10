export const IntlHelper = {
  formatNumberCurrency(
    n: number,
    locale: string,
    currencyFormat: 'USD' | 'BRL',
  ): string {
    return Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyFormat,
    }).format(n)
  },

  formatDateMonthLong(d: string, locale: string) {
    return Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(d))
  },

  formatDateMonthLongWithTime(d: string, locale: string) {
    return Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(d))
  },
}
