import type { Locale } from '.'

import Pagination from '@v-c/pagination/locale/hu_HU'
import Calendar from '../calendar/locale/hu_HU'
import DatePicker from '../date-picker/locale/hu_HU'
import TimePicker from '../time-picker/locale/hu_HU'

const localeValues: Locale = {
  locale: 'hu',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    close: 'Bezárás',
    placeholder: 'Kérem válasszon',
    sortable: 'válogatható',
  },
  Table: {
    filterTitle: 'Szűrők',
    filterConfirm: 'Alkalmazás',
    filterReset: 'Visszaállítás',
    selectAll: 'Jelenlegi oldal kiválasztása',
    selectInvert: 'Jelenlegi oldal inverze',
    sortTitle: 'Rendezés',
    filterEmptyText: 'Nincsenek szűrők',
    filterCheckAll: 'Válassza ki az összes elemet',
    filterSearchPlaceholder: 'Keresés a szűrőkben',
    emptyText: 'Nincs adat',
    selectNone: 'Minden adat törlése',
    selectionAll: 'Válassza ki az összes adatot',
    expand: 'Sor kibontása',
    collapse: 'Sor összecsukása',
    triggerDesc: 'Kattintson ide a csökkenő sorrendbe rendezéshez',
    triggerAsc: 'Kattintson a növekvő sorrendbe rendezéshez',
    cancelSort: 'Kattintson a rendezés megszakításához',
  },
  Modal: {
    okText: 'Alkalmazás',
    cancelText: 'Visszavonás',
    justOkText: 'Alkalmazás',
  },
  Popconfirm: {
    okText: 'Alkalmazás',
    cancelText: 'Visszavonás',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Keresés',
    itemUnit: 'elem',
    itemsUnit: 'elemek',
    remove: 'Távolítsa el',
    selectAll: 'Válassza ki az összes adatot',
    deselectAll: 'Törölje az összes adat kijelölését',
    selectCurrent: 'Válassza ki az aktuális oldalt',
    selectInvert: 'Az aktuális oldal megfordítása',
    removeAll: 'Távolítsa el az összes adatot',
    removeCurrent: 'Az aktuális oldal eltávolítása',
  },
  Upload: {
    uploading: 'Feltöltés...',
    removeFile: 'Fájl eltávolítása',
    uploadError: 'Feltöltési hiba',
    previewFile: 'Fájl előnézet',
    downloadFile: 'Fájl letöltése',
  },
  Empty: {
    description: 'Nincs adat',
  },
  Tour: {
    Next: 'Következő',
    Previous: 'Előző',
    Finish: 'Befejezés',
  },
  Text: {
    edit: 'Szerkesztés',
    copy: 'Másolás',
    copied: 'Másolva',
    expand: 'Bontsa ki',
    collapse: 'Összeomlás',
  },
  QRCode: {
    expired: 'A QR kód lejárt',
    refresh: 'Frissítés',
    scanned: 'Beolvasva',
  },
  ColorPicker: {
    presetEmpty: 'Üres',
    transparent: 'Átlátszó',
    singleColor: 'Egyszínű',
    gradientColor: 'Gradiens szín',
  },
}

export default localeValues
