//引入dispatch初始化变量
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
	var finalReducer = {}
		//找出reducers中value值为function的部分,赋值到finalReducer中
	for (var i = 0, len = reducerKeys.length; i < len; i++) {
		var key = reducerKeys[i];
		if (typeof reducers[key] === 'function') {
			finalReducer[key] = reducers[key]
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
	 * 函数式API，始终保持闭包访问(与createStore中的subscribe思路相同)
	 */
	return function combination(state = {}, action = {}) {
		if (sanityError) {
			throw sanityError
		}

		if (process.env.NODE_ENV !== 'production') {
			var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action)
			if (warningMessage) {
				warning(warningMessage)
			}
		}
		var hashChanged = true
		var nextState = {}
			/**
			 * 遍历访问finalReducers
			 */
		for (var i = 0; i < finalReducerKeys.length; i++) {
			var key = finalReducerKeys[i]
			var reducer = finalReducers[key]

		}
	}
}