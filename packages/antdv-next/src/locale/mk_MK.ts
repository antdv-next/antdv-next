import type { Locale } from '.'

import Pagination from '@v-c/pagination/locale/mk_MK'
import Calendar from '../calendar/locale/mk_MK'
import DatePicker from '../date-picker/locale/mk_MK'
import TimePicker from '../time-picker/locale/mk_MK'

const localeValues: Locale = {
  locale: 'mk',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  global: {
    placeholder: 'Ве молиме означете',
    close: 'Затвори',
    sortable: 'подредливи',
  },
  Table: {
    filterTitle: 'Мени за филтрирање',
    filterConfirm: 'ОК',
    filterReset: 'Избриши',
    selectAll: 'Одбери страница',
    selectInvert: 'Инвертирај страница',
    filterEmptyText: 'Нема филтри',
    filterCheckAll: 'Изберете ги сите ставки',
    filterSearchPlaceholder: 'Барај во филтри',
    emptyText: 'Нема податоци',
    selectNone: 'Исчистете ги сите податоци',
    selectionAll: 'Изберете ги сите податоци',
    sortTitle: 'Подреди',
    expand: 'Проширете го редот',
    collapse: 'Собери ред',
    triggerDesc: 'Кликнете за да сортирате опаѓачки',
    triggerAsc: 'Кликнете за да сортирате растечки',
    cancelSort: 'Кликнете за да го откажете сортирањето',
  },
  Tour: {
    Next: 'Следно',
    Previous: 'Претходно',
    Finish: 'Заврши',
  },
  Modal: {
    okText: 'ОК',
    cancelText: 'Откажи',
    justOkText: 'ОК',
  },
  Popconfirm: {
    okText: 'ОК',
    cancelText: 'Откажи',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Пребарај тука',
    itemUnit: 'предмет',
    itemsUnit: 'предмети',
    remove: 'Отстрани',
    selectAll: 'Изберете ги сите податоци',
    deselectAll: 'Деселектирај ги сите податоци',
    selectCurrent: 'Изберете тековна страница',
    selectInvert: 'Превртете ја тековната страница',
    removeAll: 'Отстранете ги сите податоци',
    removeCurrent: 'Отстранете ја моменталната страница',
  },
  Upload: {
    uploading: 'Се прикачува...',
    removeFile: 'Избриши фајл',
    uploadError: 'Грешка при прикачување',
    previewFile: 'Прикажи фајл',
    downloadFile: 'Преземи фајл',
  },
  Empty: {
    description: 'Нема податоци',
  },
  Icon: {
    icon: 'Икона',
  },
  Text: {
    edit: 'Уреди',
    copy: 'Копирај',
    copied: 'Копирано',
    expand: 'Зголеми',
    collapse: 'Колапс',
  },
  QRCode: {
    expired: 'QR-кодот е истечен',
    refresh: 'Освежи',
    scanned: 'Скенирано',
  },
  ColorPicker: {
    presetEmpty: 'Празен',
    transparent: 'Транспарентен',
    singleColor: 'Еднобојна',
    gradientColor: 'Боја на градиент',
  },
}

export default localeValues
