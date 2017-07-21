/**
 * Created by slashhuang on 16/3/8.
 */
/**
 * 中间件测试
 */

const logger = store => next => action => {
        let result = next(action)
        return result
};
const thunkMiddleware= store => next => action => {
        let {dispatch,getState}=store;
        if (typeof action == 'function') {
                return action(dispatch, getState);
         }
        return next(action);
};

/**
 * 使用修改过的store
 */
import todoApp from './reducers';
/**
 * 所有接口放在src/index.js
 */
import {
        createStore,
        combineReducers,
        applyMiddleware
} from '../src/index.js'

let store = applyMiddleware(logger,thunkMiddleware)(createStore(todoApp))
/**
 * 监听 state 更新时，打印日志
 * 注意 subscribe() 返回一个函数用来注销监听器
 */
let common=(index)=>{
        document.body.innerHTML+=`subscribe${index+JSON.stringify(store.getState())}`
};
let unsubscribe = store.subscribe(() =>common(1));
let unsubscribe1 = store.subscribe(() =>common(2))
/**
 * 发起一系列 action
 */
store.dispatch({
   name:'Learn about actions',
   type:'action1'
});
store.dispatch({
   name:'Learn about action2',
   type:'action2'
});
// 停止监听 state 更新
unsubscribe();
unsubscribe1()
