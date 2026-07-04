import type { Locale } from '.'

import Pagination from '@v-c/pagination/locale/lv_LV'
import Calendar from '../calendar/locale/lv_LV'
import DatePicker from '../date-picker/locale/lv_LV'
import TimePicker from '../time-picker/locale/lv_LV'

const localeValues: Locale = {
  locale: 'lv',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    close: 'Aizvērt',
    placeholder: 'Lūdzu, atlasiet',
    sortable: 'šķirojams',
  },
  Table: {
    filterTitle: 'Filtrēšanas izvēlne',
    filterConfirm: 'OK',
    filterReset: 'Atiestatīt',
    selectAll: 'Atlasiet pašreizējo lapu',
    selectInvert: 'Pārvērst pašreizējo lapu',
    filterEmptyText: 'Nav filtru',
    filterCheckAll: 'Atlasiet visus vienumus',
    filterSearchPlaceholder: 'Meklēt filtros',
    emptyText: 'Nav datu',
    selectNone: 'Notīrīt visus datus',
    selectionAll: 'Atlasiet visus datus',
    sortTitle: 'Kārtot',
    expand: 'Izvērst rindu',
    collapse: 'Sakļaut rindu',
    triggerDesc: 'Noklikšķiniet, lai kārtotu dilstošā secībā',
    triggerAsc: 'Noklikšķiniet, lai kārtotu augošā secībā',
    cancelSort: 'Noklikšķiniet, lai atceltu kārtošanu',
  },
  Tour: {
    Next: 'Nākamais',
    Previous: 'Iepriekšējais',
    Finish: 'Pabeigt',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Atcelt',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Atcelt',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Meklēt šeit',
    itemUnit: 'vienumu',
    itemsUnit: 'vienumus',
    remove: 'Noņemt',
    selectAll: 'Atlasiet visus datus',
    deselectAll: 'Noņemiet visu datu atlasi',
    selectCurrent: 'Atlasiet pašreizējo lapu',
    selectInvert: 'Apgriezt pašreizējo lapu',
    removeAll: 'Noņemiet visus datus',
    removeCurrent: 'Noņemt pašreizējo lapu',
  },
  Upload: {
    uploading: 'Augšupielāde...',
    removeFile: 'Noņemt failu',
    uploadError: 'Augšupielādes kļūda',
    previewFile: 'Priekšskatiet failu',
    downloadFile: 'Lejupielādēt failu',
  },
  Empty: {
    description: 'Nav datu',
  },
  Text: {
    edit: 'Rediģēt',
    copy: 'Kopēt',
    copied: 'Kopēts',
    expand: 'Izvērst',
    collapse: 'Sakļaut',
  },
  QRCode: {
    expired: 'QR kods ir beidzies',
    refresh: 'Atsvaidzināt',
    scanned: 'Skenēts',
  },
  ColorPicker: {
    presetEmpty: 'Tukšs',
    transparent: 'Caurspīdīgs',
    singleColor: 'Vienkrāsains',
    gradientColor: 'Gradienta krāsa',
  },
}

export default localeValues
