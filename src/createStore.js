//从node_modules中引入
import isPlainObject from 'lodash/isPlainObject'
//dispatch初始化的变量
export var ActionTypes = {
		INIT: '@@redux/INIT'
	}
	//enhancer增前器
export default function createStore(reducer, initialState, enhancer) {
	//当没有传入initialState的时候,如果此时传入了enhancer，修正enhancer
	if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
		enhancer = initialState
		initialState = undefined
	}
	//当传入了enhancer的时候
	if (typeof enhancer !== 'undefined') {
		if (typeof enhancer !== 'function') {
			//enhancer必须为函数
			throw new Error('Expected the enhancer to be a function.')
		}
		return enhancer(createStore)(reducer, initialState)
	}
	//reducer必须为函数
	if (typeof reducer !== 'function') {
		throw new Error('Expected the reducer to be a function.')
	}
	//初始化
	var currentReducer = reducer
	var currentState = initialState
	var currentListeners = []
		//currentListeners, nextListeners = []
	var nextListeners = currentListeners
	var isDispatching = false;
	//加入其它辅助函数
	function ensureCanMutateNextListeners() {
		//直接比较？
		if (nextListeners === currentListeners) {
			//nextListeners为
			nextListeners = currentListeners.slice()
		}
	}
	/**
	 * 获取当前状态
	 */
	function getState() {
		return currentState
	}
	//订阅
	//state观察者添加进nextListeners数组
	function subscribe(listener) {
		if (typeof listener !== 'function') {
			throw new Error('Expected listener to be a function.')
		}
		var isSubscribed = true;
		ensureCanMutateNextListeners()
		nextListeners.push(listener);
		return function unsubscribe() {
			//获得对isSubscribed的闭包，unsubscribe只能调用一次
			if (!isSubscribed) {
				return
			}
			isSubscribed = false
			ensureCanMutateNextListeners()
			var index = nextListeners.indexOf(listener)
				//去掉nextListeners中的listener观察者回调
			nextListeners.splice(index, 1)
		}
	}
	/**
	 * 唯一改变state的接口
	 * 生成nextState同时通知观察者
	 * 每次dispatch都会执行state的观察者
	 *
	 * return action这样设计比较好的一点是方便扩展中间件
	 */
	function dispatch(action) {
		//错误处理
		if (!isPlainObject(action)) {
			throw new Error(
				'Actions must be plain objects. ' +
				'Use custom middleware for async actions.'
			)
		}
		if (typeof action.type === 'undefined') {
			throw new Error(
				'Actions may not have an undefined "type" property. ' +
				'Have you misspelled a constant?'
			)
		}
		if (isDispatching) {
			throw new Error('Reducers may not dispatch actions.')
		}
		//将当前状态和action作为参数传值给reducer,生成下个状态
		try {
			isDispatching = true
				//调用reducer函数更新当前状态
			currentState = currentReducer(currentState, action)
		} finally {
			isDispatching = false
		}
		var listeners = currentListeners = nextListeners
		for (var i = 0; i < listeners.length; i++) {
			/**
			 *  遍历subscribe的观察者
			 */
			listeners[i]()
		}
		return action
	}
	/**
	 * 替换原先reducer的接口
	 * 重新初始化reducers和store
	 */
	function replaceReducer(nextReducer) {
		if (typeof nextReducer !== 'function') {
			throw new Error('Expected the nextReducer to be a function.')
		}

		currentReducer = nextReducer
			//dispatch一个初始化变量代表初始化
		dispatch({
			type: ActionTypes.INIT
		})
	}
	//初始化
	dispatch({
		type: ActionTypes.INIT
	})
	return {
		dispatch,
		subscribe,
		getState,
		replaceReducer //重新初始化reducers和store,重置store的接口
	}
}