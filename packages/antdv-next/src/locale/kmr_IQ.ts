import type { Locale } from '.'

import Pagination from '@v-c/pagination/locale/kmr_IQ'
import Calendar from '../calendar/locale/kmr_IQ'
import DatePicker from '../date-picker/locale/kmr_IQ'
import TimePicker from '../time-picker/locale/kmr_IQ'

const localeValues: Locale = {
  locale: 'ku',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    close: 'Betal ke',
    placeholder: 'Ji kerema xwe hilbijêre',
    sortable: 'sorkirin',
  },
  Table: {
    filterTitle: 'Menuê peldanka',
    filterConfirm: 'Temam',
    filterReset: 'Jê bibe',
    selectAll: 'Hemî hilbijêre',
    selectInvert: 'Hilbijartinan veguhere',
    filterEmptyText: 'Parzûn tune',
    filterCheckAll: 'Hemî tiştan hilbijêrin',
    filterSearchPlaceholder: 'Di parzûnan de bigerin',
    emptyText: 'Daneyên tune',
    selectNone: 'Hemî daneyan paqij bike',
    selectionAll: 'Hemî daneyan hilbijêrin',
    sortTitle: 'Sort',
    expand: 'Rêzê berfireh bike',
    collapse: 'Rêzê hilweşîne',
    triggerDesc: 'Bikirtînin ji bo rêzkirina daketî',
    triggerAsc: 'Ji bo rêzkirina hilkişînê bikirtînin',
    cancelSort: 'Ji bo betalkirina dabeşkirinê bikirtînin',
  },
  Tour: {
    Next: 'Temam',
    Previous: 'Betal ke',
    Finish: 'Temam',
  },
  Modal: {
    okText: 'Temam',
    cancelText: 'Betal ke',
    justOkText: 'Temam',
  },
  Popconfirm: {
    okText: 'Temam',
    cancelText: 'Betal ke',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Lêgerîn',
    itemUnit: 'tişt',
    itemsUnit: 'tişt',
    remove: 'Rakirin',
    selectAll: 'Hemî daneyan hilbijêrin',
    deselectAll: 'Hemî daneyan jêbirin',
    selectCurrent: 'Rûpelê heyî hilbijêrin',
    selectInvert: 'Rûpelê heyî berovajî bikin',
    removeAll: 'Hemî daneyan jêbirin',
    removeCurrent: 'Rûpelê heyî jêbirin',
  },
  Upload: {
    uploading: 'Bardike...',
    removeFile: 'Pelê rabike',
    uploadError: 'Xeta barkirine',
    previewFile: 'Pelê pêşbibîne',
    downloadFile: 'Pelê dakêşin',
  },
  Empty: {
    description: 'Agahî tune',
  },
  Text: {
    edit: 'Sererast bike',
    copy: 'Kopî bike',
    copied: 'Kopî kirin',
    expand: 'Zêdetir nîşan bide',
    collapse: 'Hilweşîn',
  },
  QRCode: {
    expired: 'Koda QR qediya',
    refresh: 'Refresh',
    scanned: 'Scanned',
  },
  ColorPicker: {
    presetEmpty: 'Empty',
    transparent: 'Transparent',
    singleColor: 'Yek reng',
    gradientColor: 'Rengê gradient',
  },
}

export default localeValues
