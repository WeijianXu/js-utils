import Vue from 'vue';

/**
 * 实现将组件的真实DOM挂载到特定元素上，常用于弹框等组件
 * @param {VueInstance} Component vue组件引用
 * @param {Object} props 第一个参数所需要的 props 
 * @param {HTMLElement} targetElement 挂载到指定元素下面，默认是 document.body
 * @returns 
 */
export default function createTransfer(Component, props, targetElement = document.body) {
  // 借鸡生蛋new Vue({render() {}}),在render中把Component作为根组件
  // debugger;
  const vm = new Vue({
    // h是createElement函数，它可以返回虚拟dom
    render(h) {
      // 将Component作为根组件渲染出来
      // h(标签名称或组件配置对象，传递属性、事件等，孩子元素)
      return h(Component, { props });
    },
  }).$mount(); // 挂载是为了把虚拟dom变成真实dom
  // 不挂载就没有真实dom
  // 手动追加至body
  // 挂载之后$el可以访问到真实dom
  targetElement.appendChild(vm.$el);

  // 实例
  const comp = vm.$children[0];

  // 淘汰机制
  comp.remove = () => {
    // 删除dom，并确定该DOM没有被移除
    if (vm.$el.parentNode) {
      targetElement.removeChild(vm.$el);
    }

    // 销毁组件
    vm.$destroy();
  };

  // 返回Component组件实例
  return comp;
}
