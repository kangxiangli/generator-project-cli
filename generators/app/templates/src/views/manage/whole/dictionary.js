
const PASSWORD = {
  PARAM_VALUE: [
    {
      name: '正则扣分占比',
      value: '65%'
    },
    {
      name: '关键字扣分占比',
      value: '35%'
    },
    {
      name: '最大密码长度',
      value: 32
    },
    {
      name: '内置关键词（可追加）',
      value: '',
      children: [
        {
          name: 'password',
          value: '',
          case: ''
        },
        {
          name: 'iloveyou',
          value: '',
          case: ''
        },
        {
          name: 'sunshine',
          value: '',
          case: ''
        },
        {
          name: 1314,
          value: '',
          case: ''
        },
        {
          name: 520,
          value: '',
          case: ''
        },
        {
          name: 'a1b2c3',
          value: '',
          case: ''
        },
        {
          name: 'admin',
          value: '',
          case: ''
        }
      ]
    },
    {
      name: '内置正则及对应占比（可追加）',
      value: '',
      children: [
        {
          name: '单字符循环',
          value: '40%',
          case: '// aaaaaaaaa'
        },
        {
          name: '双至多字符重复',
          value: '15%',
          case: '// aabbcc aaabbbccc'
        },
        {
          name: '双至多字符段重复',
          value: '12%',
          case: '// abab abcabc'
        },
        {
          name: '数字递增/递减',
          value: '20%',
          case: '// 123 567 3456'
        },
        {
          name: '字母递增',
          value: '18%',
          case: '// abc bcde'
        },
        {
          name: '键盘顺序',
          value: '10%',
          case: '// qwe rtyu'
        },
        {
          name: '日期',
          value: '30%',
          case: '// 19901020 20162010'
        }
      ]
    },
    {
      name: '字符基础分',
      value: '50 ÷ 最大密码长度 × 当前密码长度'
    },
    {
      name: '总分最高分',
      value: 100
    },
    {
      name: '总分最低分',
      value: 0
    }
  ],
  // 基础得分算法
  SCORE: [
    {
      name: '长度',
      value: 'grade +=（50 ÷ 最大密码长度 × 当前密码长度）'
    },
    {
      name: '字符种类',
      value: '',
      children: [
        {
          name: '数字',
          value: 'grade +=（10 ÷ 128 × 50）',
          case: ''
        },
        {
          name: '小写字母',
          value: 'grade +=（26 ÷ 128 × 50）',
          case: ''
        },
        {
          name: '大写字母',
          value: 'grade +=（26 ÷ 128 × 50）',
          case: ''
        },
        {
          name: '字符',
          value: 'grade +=（66 ÷ 128 × 50）',
          case: ''
        }
      ]
    }
  ],
  // 正则扣分算法
  DEDUCTION: 'grade -= 当前密码匹配正则匹配到的字符段，长度总和 × （1 - 字符基础分 × 正则扣分占比 × （当前正则对应占比 ÷ 正则及对应占比总和））'
}
export { PASSWORD }
