//从node_modules中引入
import isPlainObject from 'lodash/isPlainObject'
//dispatch初始化的接口
export var ActionTypes = {
		INIT: '@@redux/INIT'
	}
	//enhancer增前器
export default function createStore(reducer, initialStore, enhancer) {
	/**
	 * 参数类型检测
	 */
	if (typeof reducer === 'function' && typeof enhancer === 'undefined') {

	}
}