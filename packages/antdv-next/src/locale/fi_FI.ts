import type { Locale } from '.'

import Pagination from '@v-c/pagination/locale/fi_FI'
import Calendar from '../calendar/locale/fi_FI'
import DatePicker from '../date-picker/locale/fi_FI'
import TimePicker from '../time-picker/locale/fi_FI'

const localeValues: Locale = {
  locale: 'fi',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    close: 'Sulje',
    placeholder: 'Ole hyvä ja valitse',
    sortable: 'lajiteltava',
  },
  Table: {
    filterTitle: 'Suodatus valikko',
    filterConfirm: 'OK',
    filterReset: 'Tyhjennä',
    selectAll: 'Valitse kaikki',
    selectInvert: 'Valitse päinvastoin',
    sortTitle: 'Lajittele',
    triggerDesc: 'Lajittele laskevasti',
    triggerAsc: 'Lajittele nousevasti',
    cancelSort: 'Peruuta lajittelu',
    filterEmptyText: 'Ei suodattimia',
    filterCheckAll: 'Valitse kaikki kohteet',
    filterSearchPlaceholder: 'Hae suodattimista',
    emptyText: 'Ei dataa',
    selectNone: 'Tyhjennä kaikki tiedot',
    selectionAll: 'Valitse kaikki tiedot',
    expand: 'Laajenna riviä',
    collapse: 'Tiivistä rivi',
  },
  Tour: {
    Next: 'Seuraava',
    Previous: 'Edellinen',
    Finish: 'Valmis',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Peruuta',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Peruuta',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Etsi täältä',
    itemUnit: 'kohde',
    itemsUnit: 'kohdetta',
    remove: 'Poista',
    selectAll: 'Valitse kaikki tiedot',
    deselectAll: 'Poista kaikkien tietojen valinnat',
    selectCurrent: 'Valitse nykyinen sivu',
    selectInvert: 'Kääntää nykyinen sivu',
    removeAll: 'Poista kaikki tiedot',
    removeCurrent: 'Poista nykyinen sivu',
  },
  Upload: {
    uploading: 'Lähetetään...',
    removeFile: 'Poista tiedosto',
    uploadError: 'Virhe lähetyksessä',
    previewFile: 'Esikatsele tiedostoa',
    downloadFile: 'Lataa tiedosto',
  },
  Empty: {
    description: 'Ei kohteita',
  },
  Text: {
    edit: 'Muokkaa',
    copy: 'Kopioi',
    copied: 'Kopioitu',
    expand: 'Näytä lisää',
    collapse: 'Kutista',
  },
  QRCode: {
    expired: 'QR-koodi vanhentunut',
    refresh: 'Päivitä',
    scanned: 'Skannattu',
  },
  ColorPicker: {
    presetEmpty: 'Tyhjä',
    transparent: 'Läpinäkyvä',
    singleColor: 'Yksivärinen',
    gradientColor: 'Gradienttiväri',
  },
}

export default localeValues
