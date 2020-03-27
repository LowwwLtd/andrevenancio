import { createBrowserHistory, createMemoryHistory } from 'history';

export default global.window !== undefined
    ? createBrowserHistory()
    : createMemoryHistory();
