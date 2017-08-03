/**
 * 
 */

import isPlainObject from 'lodash/isPlainObject'
//dispatch初始化的接口
export var ActionTypes = {
        INIT: '@@redux/INIT'
    }
    //总体来说，createStore通过闭包来维护内部状态。处理核心的dispatch和reducer调用，并在更新状态之后调用观察者listener
export default function createStore(reducer, initialState, enhancer) {
    /**
     * 参数类型检测
     */
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
        //在没传initialState的时候，判断出enhancer
        enhancer = initialState
        initialState = undefined
    }
    if (typeof enhancer !== 'undefined') {
        //当传了enhancer却不是函数，则抛出错误
        if (typeof enhancer !== 'function') {
            throw new Error('Expected the enhancer to be a function.')
        }
        //正确传递enhancer的时候
        return enhancer(createStore)(reducer, initialState)
    }
    if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.')
    }
    /**
     * 初始化数据
     */
    var currentReducer = reducer
    var currentState = initialState
    var currentListeners = []
    var nextListeners = currentListeners
    var isDispatching = false;
    /**
     * 创建复制的新数组
     */
    function ensureCanMutateNextListeners() {
        //当两个数组是同一个引用的时候，将nextListeners变成currentListeners的拷贝
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }

    /**
     * 获取当前状态
     */
    function getState() {
        return currentState
    }

    /**
     * state观察者添加进nextListeners数组
     * 返回unsubscribe函数取消监听
     */
    function subscribe(listener) {
        //监听listener不是函数的时候抛出错误
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }
        var isSubscribed = true;
        ensureCanMutateNextListeners()
            //nextListeners拷贝完currentListeners之后，push新的listener
        nextListeners.push(listener);
        //返回接口,利用闭包可以保持对相应listener的访问
        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }
            isSubscribed = false
            ensureCanMutateNextListeners()
            var index = nextListeners.indexOf(listener)
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
        /**
         * 错误处理
         */
        //当action不是对象
        if (!isPlainObject(action)) {
            throw new Error(
                'Actions must be plain objects. ' +
                'Use custom middleware for async actions.'
            )
        }
        //当action.type未定义
        if (typeof action.type === 'undefined') {
            throw new Error(
                'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?'
            )
        }

        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }
        /**
         * 将当前状态和action作为参数传值给reducer,生成下个状态
         */
        try {
            isDispatching = true
                //reducer处理返回状态
            currentState = currentReducer(currentState, action)
        } finally {
            //reducer处理之后isDispatching设置为false
            isDispatching = false
        }
        //处理完状态之后，遍历执行所有的监听函数
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

        dispatch({
            type: ActionTypes.INIT
        })
    }

    /**
     * 手动dispatch的接口
     */
    dispatch({
            type: ActionTypes.INIT
        })
        /**
         * store的所有数据都必须采取setter和getter的方式获取
         */
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer //重新初始化reducers和store,重置store的接口
    }
}