import {
    ActionTypes
} from './createStore'
import isPlainObject from 'lodash/isPlainObject'
/**
 * 异常处理部分
 */
import warning from './utils/warning'
import {
    getUndefinedStateErrorMessage,
    getUnexpectedStateShapeWarningMessage,
    assertReducerSanity
} from './utils/exception.js';

/**
 * 把reducer函数对象整合为单一reducer函数，它会遍历所有的子reducer成员，并把结果整合进单一状态树
 * 这个状态树对象的key值和函数名保持一致
 *
 * 参数即为reducers对象
 *
 * 返回的函数在执行的时候，会遍历reducers返回结果
 *
 */
export default function combineReducers(reducers) {
    var reducerKeys = Object.keys(reducers)
    var finalReducers = {}
        //先提取reducers对象中的key
    for (var i = 0; i < reducerKeys.length; i++) {
        var key = reducerKeys[i]
            //从reducers对象的value中提取function
        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key]
        }
    }
    var finalReducerKeys = Object.keys(finalReducers)

    var sanityError
    try {
        assertReducerSanity(finalReducers)
    } catch (e) {
        sanityError = e
    }
    /**
     * 函数式API，保持闭包访问
     */
    return function combination(state = {}, action = {}) {
        //错误处理
        if (sanityError) {
            throw sanityError
        }

        if (process.env.NODE_ENV !== 'production') {
            var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action)
            if (warningMessage) {
                warning(warningMessage)
            }
        }

        var hasChanged = false
        var nextState = {}
            /**
             * 遍历访问finalReducers
             */
        for (var i = 0; i < finalReducerKeys.length; i++) {
            var key = finalReducerKeys[i]
            var reducer = finalReducers[key]
                /**
                 *将state按照reducer的名字分离
                 * 每个key都对应着state
                 */
            var previousStateForKey = state[key];
            //reducer函数
            var nextStateForKey = reducer(previousStateForKey, action)
            if (typeof nextStateForKey === 'undefined') {
                var errorMessage = getUndefinedStateErrorMessage(key, action)
                throw new Error(errorMessage)
            }
            nextState[key] = nextStateForKey
                //如果nextStateForKey !== previousStateForKey，hasChanged为true
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        }
        return hasChanged ? nextState : state
    }
}