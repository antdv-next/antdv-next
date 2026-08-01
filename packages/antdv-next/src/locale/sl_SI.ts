import type { Locale } from '.'

import Pagination from '@v-c/pagination/locale/sl_SI'
import Calendar from '../calendar/locale/sl_SI'
import DatePicker from '../date-picker/locale/sl_SI'
import TimePicker from '../time-picker/locale/sl_SI'

const localeValues: Locale = {
  locale: 'sl',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    close: 'Zapri',
    placeholder: 'Prosim izberite',
    sortable: 'razvrstljiv',
  },
  Table: {
    filterTitle: 'Filter',
    filterConfirm: 'Filtriraj',
    filterReset: 'Pobriši filter',
    selectAll: 'Izberi vse na trenutni strani',
    selectInvert: 'Obrni izbor na trenutni strani',
    filterEmptyText: 'Brez filtrov',
    filterCheckAll: 'Izberite vse elemente',
    filterSearchPlaceholder: 'Išči v filtrih',
    emptyText: 'Ni podatkov',
    selectNone: 'Počisti vse podatke',
    selectionAll: 'Izberite vse podatke',
    sortTitle: 'Razvrsti',
    expand: 'Razširi vrstico',
    collapse: 'Strni vrstico',
    triggerDesc: 'Kliknite za razvrščanje padajoče',
    triggerAsc: 'Kliknite za razvrščanje naraščajoče',
    cancelSort: 'Kliknite za preklic razvrščanja',
  },
  Tour: {
    Next: 'Naprej',
    Previous: 'Prejšnje',
    Finish: 'Končaj',
  },
  Modal: {
    okText: 'V redu',
    cancelText: 'Prekliči',
    justOkText: 'V redu',
  },
  Popconfirm: {
    okText: 'v redu',
    cancelText: 'Prekliči',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Išči tukaj',
    itemUnit: 'Objekt',
    itemsUnit: 'Objektov',
    remove: 'Odstrani',
    selectAll: 'Izberite vse podatke',
    deselectAll: 'Počisti vse podatke',
    selectCurrent: 'Izberite trenutno stran',
    selectInvert: 'Obrni trenutno stran',
    removeAll: 'Odstrani vse podatke',
    removeCurrent: 'Odstrani trenutno stran',
  },
  Upload: {
    uploading: 'Nalaganje...',
    removeFile: 'Odstrani datoteko',
    uploadError: 'Napaka pri nalaganju',
    previewFile: 'Predogled datoteke',
    downloadFile: 'Prenos datoteke',
  },
  Empty: {
    description: 'Ni podatkov',
  },
  Text: {
    edit: 'Uredi',
    copy: 'Kopiraj',
    copied: 'Kopirano',
    expand: 'Razširi',
    collapse: 'Strni',
  },
  QRCode: {
    expired: 'Koda QR je potekla',
    refresh: 'Osveži',
    scanned: 'skenirano',
  },
  ColorPicker: {
    presetEmpty: 'prazno',
    transparent: 'Transparentna',
    singleColor: 'Enobarvna',
    gradientColor: 'Prelivna barva',
  },
}

export default localeValues
