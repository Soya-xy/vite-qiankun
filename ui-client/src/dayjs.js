import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'

dayjs.locale('zh-cn')
dayjs.extend(duration)
