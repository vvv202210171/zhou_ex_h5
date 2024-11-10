export default {
  'input-line': {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el) {
      // 聚焦元素时改变父节点底线颜色
      el.onfocus = function() {
        el.parentElement.className += ' input_focus'
        // el.parentElement.parentElement.style.borderColor = '#334186'
      }
      el.onblur = function() {
        el.parentElement.classList.remove('input_focus')
      }
    }
  },
  'input-line-parent': {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el) {
      // 聚焦元素时改变父节点底线颜色
      el.onfocus = function() {
        el.parentElement.parentElement.className += ' input_focus'
        // el.parentElement.parentElement.style.borderColor = '#334186'
      }
      el.onblur = function() {
        el.parentElement.parentElement.classList.remove('input_focus')
      }
    }
  },

  // 输入框只允许输入正整数
  'intNumber': {
    inserted: function(el) {
      el.addEventListener('keypress', function(e) {
        e = e || window.event
        const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
        const re = /\d/
        if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        }
      })
    }
  },

  // 只能输入整数
  onlyNum: (el, binding, vnode) => {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.oninput = function() {
      // 获取相关的指令配置信息
      const rel = vnode.data.directives.filter(item => {
        return item.name === 'only-num'
      })[0]
      vnode.context.$nextTick(() => {
        handleInput(ele, vnode, rel)
      })
    }
  },

  /** *
  * 防抖 单位时间只触发最后一次
  *  @param {?Number|300} time - 间隔时间
  *  @param {Function} fn - 执行事件
  *  @param {?String|"click"} event - 事件类型 例："click"
  *  @param {Array} binding.value - [fn,event,time]
  *  @date  2020-1-29
  *  @author aChuan
  *  例：<el-button v-debounce="[reset,`click`,300]">刷新</el-button>
  *  也可简写成：<el-button v-debounce="[reset]">刷新</el-button>
  */
  'debounce': {
    inserted: function(el, binding) {
      const [fn, event = 'click', time = 300] = binding.value
      let timer
      el.addEventListener(event, () => {
        timer && clearTimeout(timer)
        timer = setTimeout(() => fn(), time)
      })
    }
  },
  /** *
  *  节流 每单位时间可触发一次
  *  第一次瞬间触发，最后一次不管是否达到间隔时间依然触发
  * 【考虑到input的change事件】
  *  @param {?Number|300} time - 间隔时间
  *  @param {Function} fn - 执行事件
  *  @param {?String|"click"} event - 事件类型 例："click"
  *  @param {Array} binding.value - [fn,event,time]
  *  @date  2020-1-31
  *  @author aChuan
  *  例：<el-button v-throttle="[reset,`click`,300]">刷新</el-button>
  *  传递参数则：<el-button v-throttle="[()=>reset(param),`click`,300]">刷新</el-button>
  */
  'throttle': {
    inserted: function(el, binding) {
      const [fn, event = 'click', time = 300] = binding.value
      let timer, timer_end
      el.addEventListener(event, () => {
        if (timer) {
          clearTimeout(timer_end)
          return timer_end = setTimeout(() => fn(), time)
        }
        fn()
        timer = setTimeout(() => timer = null, time)
      })
    }
  }

}

/**
 * [handleInput 在输入阶段的处理逻辑]
 * @param  {[DOM]} ele   [当前指令操作的dom对象]
 * @param  {[虚拟节点]} vnode [当前指令渲染的虚拟节点]
 * @param  {[指令信息]} rel   [当前指令的所有指令信息]
 * @param  {[校验类型]} type  [输入阶段的校验类型]
 *      "number": 仅支持输入数字
 *      "float": 仅支持数字和小数点
 */
function handleInput(ele, vnode, rel) {
  let rule
  switch (true) {
    case rel.modifiers.float: // 浮点型
      rule = /[^\d\.]/g; break
    default: // 默认仅支持输入数字
      rule = /\D/g
  }
  let val = ele.value.replace(rule, '')
  const maxLen = vnode.data.attrs && vnode.data.attrs['max-len'] ? vnode.data.attrs['max-len'] : 0
  if (maxLen > 0) { val = val.substr(0, maxLen) }
  setValueWithExpressionVue({
    currObj: vnode.context.$data,
    expression: rel.expression,
    value: val,
    key: vnode.key,
    arg: rel.arg,
    toString: rel.modifiers.string || rel.modifiers.float
  })
}

/**
 * [setValueWithExpressionVue 更新数据模型]
 * @param {Boolean} toString    [是否转化为字符串]
 * @param {[type]}  currObj    [当前的数据模型]
 * @param {[type]}  expression [指令表达式]
 * @param {[type]}  value      [指令的值]
 * @param {[type]}  key        [用于批量渲染时的跟踪键]
 * @param {[type]}  arg        [指令的参数]
 */
function setValueWithExpressionVue(option) {
  const expression = option.expression.split('.')
  expression.forEach(function(item, i) {
    if (i < expression.length - 1) {
      option.currObj = option.currObj[item]
    } else {
      if (option.key !== undefined) {
        option.currObj[item][option.key][option.arg] = (option.value === '' || option.toString) ? option.value : option.value * 1
      } else {
        option.currObj[item] = (option.value === '' || option.toString) ? option.value : option.value * 1
      }
    }
  })
}
